package com.loom.incident.loader;

import com.loom.incident.domain.Incident;
import com.loom.incident.domain.IncidentStatus;
import com.loom.incident.domain.IssueType;
import com.loom.incident.domain.Severity;
import com.loom.incident.repository.IncidentRepository;
import com.loom.incident.service.IncidentService;
import com.loom.integration.cicd.DeploymentRepository;
import com.loom.integration.git.Commit;
import com.loom.integration.git.CommitRepository;
import com.loom.integration.git.Repository;
import com.loom.integration.git.RepositoryRepository;
import com.loom.sentinel.code.IncidentCodeCorrelation;
import com.loom.sentinel.code.IncidentCodeCorrelationRepository;
import com.loom.integration.cicd.DeploymentService;
import com.loom.incident.service.IncidentIndexService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Loads realistic sample incident data for demo and development purposes.
 * Runs ONLY when profile is NOT 'prod'.
 */
@Component
@Profile("!prod")
public class SampleIncidentDataLoader implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(SampleIncidentDataLoader.class);
    private static final int TARGET_INCIDENT_COUNT = 250;

    private final IncidentService incidentService;
    private final IncidentRepository incidentRepository;
    private final Random random = new Random();

    // Data Sources for Realistic Generation
    private final List<String> SERVICES = Arrays.asList(
            "payment-service", "auth-service", "order-service",
            "inventory-service", "notification-service", "search-service");

    private final List<String> ERROR_PATTERNS = Arrays.asList(
            "Connection timeout interacting with DB",
            "High memory usage causing OOM kills",
            "Latency spike in API response times",
            "5xx errors returning from upstream provider",
            "Kafka consumer lag increasing rapidly",
            "Deployment failed health check",
            "Rate limiting triggering erroneously",
            "NullPointer exception in critical path");

    private final List<String> ROOT_CAUSES = Arrays.asList(
            "Database connection pool exhausted due to unclosed sessions.",
            "Memory leak in image processing module holding buffers.",
            "Missing index on 'user_id' column causing slow queries.",
            "Third-party payment gateway outage.",
            "Misconfigured retry variance causing thundering herd.",
            "Invalid semantic versioning in recent dependency update.",
            "Redis cache eviction policy set incorrectly.");

    private final List<String> ASSIGNEES = Arrays.asList(
            "Alice DevOps", "Bob SRE", "Charlie Lead", "David Triage", "Eve Monitor");

    private final DeploymentRepository deploymentRepository;
    private final RepositoryRepository repositoryRepository;
    private final CommitRepository commitRepository;
    private final IncidentCodeCorrelationRepository correlationRepository;
    private final com.loom.sentinel.SentinelAlertService sentinelAlertService;
    private final JdbcTemplate jdbcTemplate;
    private final DeploymentService deploymentService;
    private final IncidentIndexService incidentIndexService;

    public SampleIncidentDataLoader(IncidentService incidentService, IncidentRepository incidentRepository,
            DeploymentRepository deploymentRepository, RepositoryRepository repositoryRepository,
            CommitRepository commitRepository, IncidentCodeCorrelationRepository correlationRepository,
            com.loom.sentinel.SentinelAlertService sentinelAlertService,
            JdbcTemplate jdbcTemplate,
            DeploymentService deploymentService,
            IncidentIndexService incidentIndexService) {
        this.incidentService = incidentService;
        this.incidentRepository = incidentRepository;
        this.deploymentRepository = deploymentRepository;
        this.repositoryRepository = repositoryRepository;
        this.commitRepository = commitRepository;
        this.correlationRepository = correlationRepository;
        this.sentinelAlertService = sentinelAlertService;
        this.jdbcTemplate = jdbcTemplate;
        this.deploymentService = deploymentService;
        this.incidentIndexService = incidentIndexService;
    }

    @Override
    public void run(ApplicationArguments args) {
        System.out.println(">>> CHECKING DATA LOADER STATUS <<<");
        try {
            // Fix for missing sequence error
            try {
                jdbcTemplate.execute("CREATE SEQUENCE IF NOT EXISTS incident_id_seq START WITH 1000 INCREMENT BY 1");
                System.out.println(">>> ENSURED SEQUENCE 'incident_id_seq' EXISTS");
            } catch (Exception e) {
                System.err.println(">>> FAILED TO CREATE SEQUENCE: " + e.getMessage());
            }

            // Fix for IssueType constraint mismatch (PROCESS_FAILURE missing in DB
            // constraint)
            try {
                jdbcTemplate.execute("ALTER TABLE incidents DROP CONSTRAINT IF EXISTS incidents_issue_type_check");
                jdbcTemplate.execute(
                        "ALTER TABLE incidents ADD CONSTRAINT incidents_issue_type_check CHECK (issue_type IN ('DATABASE', 'API', 'UI', 'PERFORMANCE', 'NETWORK', 'SECURITY', 'INFRASTRUCTURE', 'PROCESS_FAILURE'))");
                System.out.println(">>> UPDATED CONSTRAINT 'incidents_issue_type_check'");
            } catch (Exception e) {
                System.err.println(">>> FAILED TO UPDATE CONSTRAINT: " + e.getMessage());
            }

            long count = incidentRepository.count();
            long correlationCount = correlationRepository.count();
            System.out.println(">>> CURRENT INCIDENT COUNT: " + count);
            System.out.println(">>> CURRENT CORRELATION COUNT: " + correlationCount);

            if (count > 0 || correlationCount > 0) {
                System.out.println(">>> PURGING DATA TO ENSURE CLEAN STATE...");
                try {
                    // 1. Clear Join Table (Incident <-> Deployment)
                    jdbcTemplate.execute("DELETE FROM incident_deployments");
                    System.out.println(">>> CLEARED JOIN TABLE 'incident_deployments'");
                } catch (Exception e) {
                    System.err.println(">>> WARN: FAILED TO CLEAR JOIN TABLE: " + e.getMessage());
                }

                correlationRepository.deleteAll();
                deploymentRepository.deleteAll();
                incidentRepository.deleteAll();
                try {
                    jdbcTemplate.execute("ALTER SEQUENCE incident_id_seq RESTART WITH 1000");
                } catch (Exception e) {
                }
            }

            logger.info("Starting sample data generation for {} incidents...", TARGET_INCIDENT_COUNT);
            System.out.println(">>> GENERATING " + TARGET_INCIDENT_COUNT + " SAMPLE INCIDENTS...");

            try {
                incidentIndexService.clearAllIncidents();
            } catch (Exception e) {
                /* ignore */}

            for (int i = 0; i < TARGET_INCIDENT_COUNT; i++) {
                try {
                    Incident incident = generateRealisticIncident();

                    // 1. Create Preceding Artifacts (Deployment/Commit) FIRST
                    String potentiallyCorrelatedCommitSha = null;
                    if (random.nextInt(100) < 40) {
                        potentiallyCorrelatedCommitSha = createPrecedingArtifacts(incident);
                    }

                    // 2. Correlate Deployment (In-Memory logic mimicking IncidentService)
                    List<com.loom.integration.cicd.Deployment> recentDeployments = deploymentService
                            .findRecentDeployments(
                                    incident.getService(), "prod");
                    if (!recentDeployments.isEmpty()) {
                        incident.setCorrelatedDeployments(recentDeployments);
                        com.loom.integration.cicd.Deployment latest = recentDeployments.get(0);
                        long minutesAgo = java.time.temporal.ChronoUnit.MINUTES.between(latest.getDeploymentTime(),
                                incident.getCreatedAt());
                        // Note: Using incident.getCreatedAt() vs Instant.now() because these are
                        // historical
                        if (minutesAgo >= 0) {
                            incident.setDeploymentInsight(
                                    String.format(
                                            "This incident occurred %d minutes after a deployment to %s by %s (commit %s).",
                                            minutesAgo, incident.getService(), latest.getAuthor(),
                                            latest.getCommitHash().substring(0, 7)));
                        }
                    }

                    // 0. Generate Public ID if missing (Critical for ID generation)
                    if (incident.getPublicId() == null) {
                        Long nextSeq = incidentRepository.getNextSequenceValue();
                        incident.setSequenceId(nextSeq);
                        incident.setPublicId("INCSEN-" + nextSeq);
                    }

                    // 3. Save Incident (MUST be persisted before correlation)
                    Incident savedIncident = incidentRepository.save(incident);

                    // 4. Create Correlation (Using managed incident)
                    if (potentiallyCorrelatedCommitSha != null) {
                        createCorrelation(savedIncident, potentiallyCorrelatedCommitSha);
                    }

                    // 5. Index (Only after aggregator is complete)
                    incidentIndexService.indexIncidentAsync(savedIncident);

                } catch (Exception e) {
                    if (i == 0)
                        System.err.println(">>> INSERT ERROR (First Incident): " + e.getMessage());
                    logger.error("Failed to generate sample incident", e);
                }
            }
            createDemoIncident();
            System.out.println(">>> DATA GENERATION COMPLETED");

            // Trigger Sentinel Check Immediately
            System.out.println(">>> TRIGGERING SENTINEL CHECK <<<");
            sentinelAlertService.monitorSentinelSignals();

        } catch (Exception globalEx) {
            System.err.println(">>> CRITICAL LOADER ERROR: " + globalEx.getMessage());
            globalEx.printStackTrace();
        }
    }

    private void createDemoIncident() {
        try {
            if (incidentRepository.findByPublicId("INCSEN-8888").isPresent()) {
                return;
            }

            // 1. Prepare Incident Data (Transient)
            Incident incident = new Incident();
            incident.setPublicId("INCSEN-8888");
            incident.setTitle("NOC Backbone Latency Spike");
            incident.setDescription(
                    "Severe latency detected in the primary backbone network. Multiple services are experiencing timeouts. Causality analysis suggests a correlation with recent firmware updates on core switches.");
            incident.setSeverity(Severity.SEV1);
            incident.setStatus(IncidentStatus.OPEN);
            incident.setService("network-backbone");
            incident.setIssueType(IssueType.NETWORK);
            incident.setAssigneeName("Alice Network");
            incident.setAssigneeAvatar("https://ui-avatars.com/api/?name=Alice+Network&background=random");
            incident.setCreatedAt(Instant.now().minus(1, ChronoUnit.HOURS));
            incident.setRootCause("Firmware mismatch in Switch-Cluster-A");

            // 2. Create Preceding "Bad" Deployment FIRST
            com.loom.integration.cicd.Deployment badDeployment = new com.loom.integration.cicd.Deployment();
            badDeployment.setServiceName(incident.getService());
            badDeployment.setEnvironment("prod");
            badDeployment.setDeploymentTime(incident.getCreatedAt().minus(15, ChronoUnit.MINUTES));
            badDeployment.setRepoName("github.com/loom/" + incident.getService());
            badDeployment.setBranch("main");
            badDeployment.setAuthor("alice_dev");
            String commitSha = "a1b2c3d4e5f67890abcdef1234567890abcdef12";
            badDeployment.setCommitHash(commitSha);
            badDeployment.setCommitMessage("feat: optimize switch buffer handling via zero-copy");
            badDeployment.setStatus("success");
            deploymentRepository.save(badDeployment);

            // 3. Create Repo & Commit
            Repository repo = repositoryRepository.findAll().stream()
                    .filter(r -> r.getServiceName().equals(incident.getService()))
                    .findFirst()
                    .orElseGet(() -> {
                        Repository newRepo = new Repository();
                        newRepo.setName(incident.getService());
                        newRepo.setProvider("github");
                        newRepo.setServiceName(incident.getService());
                        return repositoryRepository.save(newRepo);
                    });

            if (!commitRepository.existsById(commitSha)) {
                Commit commit = new Commit();
                commit.setSha(commitSha);
                commit.setMessage(badDeployment.getCommitMessage());
                commit.setAuthor(badDeployment.getAuthor());
                commit.setTimestamp(badDeployment.getDeploymentTime().minus(5, ChronoUnit.MINUTES));
                commit.setRepository(repo);
                commit.setFilesChanged(Arrays.asList(
                        "src/main/java/com/loom/network/SwitchCore.java",
                        "config/buffer-settings.yaml"));
                commitRepository.save(commit);
            }

            // 4. Set Correlated Deployment (Manual linking)
            incident.setCorrelatedDeployments(java.util.Collections.singletonList(badDeployment));
            incident.setDeploymentInsight(
                    String.format("This incident occurred %d minutes after a deployment to %s by %s (commit %s).",
                            15, incident.getService(), badDeployment.getAuthor(),
                            badDeployment.getCommitHash().substring(0, 7)));

            // 5. Save Incident
            Incident savedIncident = incidentRepository.save(incident);

            // 6. Create Correlation
            IncidentCodeCorrelation correlation = new IncidentCodeCorrelation();
            correlation.setIncident(savedIncident);
            correlation.setCommitSha(commitSha);
            correlation.setConfidenceScore(0.95);
            correlation.setReason(
                    "High confidence: 'SwitchCore.java' modified in recent deployment (15m before incident). Exception stack trace matches method signatures in this file.");
            correlationRepository.save(correlation);

            // 7. Index Async (After everything is persisted)
            incidentIndexService.indexIncidentAsync(savedIncident);

            logger.info("Seeded demo incident: INCSEN-8888 with correlated deployment");
        } catch (Exception e) {
            System.err.println(">>> DEMO INCIDENT ERROR: " + e.getMessage());
            logger.error("Failed to seed demo incident INCSEN-8888", e);
        }
    }

    private String createPrecedingArtifacts(Incident incident) {
        try {
            com.loom.integration.cicd.Deployment d = new com.loom.integration.cicd.Deployment();
            d.setServiceName(incident.getService());
            d.setEnvironment("prod");
            // Deployment happened 5-45 minutes before the incident
            d.setDeploymentTime(incident.getCreatedAt().minus(5 + random.nextInt(40), ChronoUnit.MINUTES));
            d.setRepoName("github.com/loom/" + incident.getService());
            d.setBranch("main");
            String author = ASSIGNEES.get(random.nextInt(ASSIGNEES.size())).split(" ")[0].toLowerCase();
            d.setAuthor(author);
            String sha = java.util.UUID.randomUUID().toString().replace("-", "");
            d.setCommitHash(sha);
            String message;
            // Generate message based on incident issue type if available, otherwise generic
            if (incident.getIssueType() == IssueType.DATABASE) {
                message = "fix: update connection pool settings";
            } else if (incident.getIssueType() == IssueType.PERFORMANCE) {
                message = "feat: add caching layer to user service";
            } else {
                message = "feat: update " + incident.getService() + " logic";
            }
            d.setCommitMessage(message);
            d.setStatus("success");

            deploymentRepository.save(d);

            // --- Mock Git Integration Data ---
            // 1. Create Repository if not exists (simple check/create)
            Repository repo = repositoryRepository.findAll().stream()
                    .filter(r -> r.getServiceName().equals(incident.getService()))
                    .findFirst()
                    .orElseGet(() -> {
                        Repository newRepo = new Repository();
                        newRepo.setName(incident.getService());
                        newRepo.setProvider("github");
                        newRepo.setServiceName(incident.getService());
                        return repositoryRepository.save(newRepo); // Save immediate to get ID if generated
                    });

            // 2. Create Commit
            if (!commitRepository.existsById(sha)) {
                Commit commit = new Commit();
                commit.setSha(sha);
                commit.setMessage(message);
                commit.setAuthor(author);
                commit.setTimestamp(d.getDeploymentTime().minus(2, ChronoUnit.MINUTES)); // Commit slightly before
                                                                                         // deploy
                commit.setRepository(repo);
                commit.setFilesChanged(
                        Arrays.asList(
                                "src/main/java/com/loom/" + incident.getService().replace("-", "") + "/Service.java",
                                "config/application.yml"));
                commitRepository.save(commit);
            }

            return sha;

        } catch (Exception e) {
            logger.warn("Failed to create dummy deployment", e);
            return null;
        }
    }

    private void createCorrelation(Incident incident, String commitSha) {
        try {
            IncidentCodeCorrelation correlation = new IncidentCodeCorrelation();
            correlation.setIncident(incident);
            correlation.setCommitSha(commitSha);
            correlation.setConfidenceScore(0.85 + (random.nextDouble() * 0.14)); // 0.85 - 0.99
            correlation.setReason("High semantic similarity to incident description. Modified files in stack trace.");
            correlationRepository.save(correlation);
        } catch (Exception e) {
            logger.error("Failed to create correlation for publicId: " + incident.getPublicId(), e);
        }
    }

    private Incident generateRealisticIncident() {
        Incident incident = new Incident();

        // 1. Determine Severity & Status Distribution
        Severity severity = determineSeverity();
        IncidentStatus status = determineStatus();
        String service = SERVICES.get(random.nextInt(SERVICES.size()));

        // 2. Generate Content
        String errorPattern = ERROR_PATTERNS.get(random.nextInt(ERROR_PATTERNS.size()));
        String title = String.format("[%s] %s on %s", severity, errorPattern, service);

        // Vary description to make embeddings interesting
        String description = String.format(
                "Alert triggered for %s. Monitoring systems detected %s. " +
                        "Impact is currently being assessed. " +
                        "Engineers are investigating logs for correlation id: %s.",
                service, errorPattern.toLowerCase(), java.util.UUID.randomUUID().toString().substring(0, 8));

        incident.setTitle(title);
        incident.setDescription(description);
        incident.setSeverity(severity);
        incident.setStatus(status);
        incident.setService(service);
        incident.setIssueType(IssueType.values()[random.nextInt(IssueType.values().length)]);

        // Assignee
        if (random.nextBoolean()) { // 50% chance
            String name = ASSIGNEES.get(random.nextInt(ASSIGNEES.size()));
            incident.setAssigneeName(name);
            incident.setAssigneeAvatar(
                    "https://ui-avatars.com/api/?name=" + name.replace(" ", "+") + "&background=random");
        }

        // 3. Time Handling (Past 90 days)
        int daysAgo = random.nextInt(90);
        Instant createdAt = Instant.now().minus(daysAgo, ChronoUnit.DAYS).minus(random.nextInt(24), ChronoUnit.HOURS);
        incident.setCreatedAt(createdAt);

        // 4. Resolve Logic
        if (status == IncidentStatus.RESOLVED) {
            // Resolved 2-48 hours after creation
            Instant resolvedAtTime = createdAt.plus(2 + random.nextInt(48), ChronoUnit.HOURS);

            // Ensure resolvedAt is not in future
            if (resolvedAtTime.isAfter(Instant.now())) {
                resolvedAtTime = Instant.now().minus(5, ChronoUnit.MINUTES);
            }
            incident.setResolvedAt(resolvedAtTime);

            // Assign a Root Cause (shared across similar issues)
            String rootCause = ROOT_CAUSES.get(random.nextInt(ROOT_CAUSES.size()));
            incident.setRootCause(rootCause);
        } else {
            // Even for open incidents, we simulate that AI analysis has identified a likely
            // root cause
            String likelyCause = "Potential: " + ROOT_CAUSES.get(random.nextInt(ROOT_CAUSES.size()));
            incident.setRootCause(likelyCause);
        }

        return incident;
    }

    private Severity determineSeverity() {
        int r = random.nextInt(100);
        if (r < 15)
            return Severity.SEV1; // 15%
        if (r < 50)
            return Severity.SEV2; // 35% (15+35=50)
        return Severity.SEV3; // 50%
    }

    private IncidentStatus determineStatus() {
        int r = random.nextInt(100);
        if (r < 60)
            return IncidentStatus.RESOLVED; // 60%
        return IncidentStatus.OPEN; // 40%
    }
}
