package com.loom.incident.loader;

import com.loom.incident.domain.Incident;
import com.loom.incident.domain.IncidentStatus;
import com.loom.incident.domain.IssueType;
import com.loom.incident.domain.Severity;
import com.loom.incident.repository.IncidentRepository;
import com.loom.incident.service.IncidentService;
import com.loom.integration.cicd.DeploymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

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

    public SampleIncidentDataLoader(IncidentService incidentService, IncidentRepository incidentRepository,
            DeploymentRepository deploymentRepository) {
        this.incidentService = incidentService;
        this.incidentRepository = incidentRepository;
        this.deploymentRepository = deploymentRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (incidentRepository.count() > 0) {
            logger.info("Data loader skipped: Incidents already exist in the database.");
            logger.info("Triggering search index synchronization to ensure data availability...");
            try {
                incidentService.syncIndex();
            } catch (Exception e) {
                logger.error("Failed to sync index during startup", e);
            }
            return;
        }

        logger.info("Starting sample data generation for {} incidents...", TARGET_INCIDENT_COUNT);

        try {
            logger.info("Clearing stale Elasticsearch index before generation...");
            try {
                incidentService.syncIndex();
            } catch (Exception e) {
                logger.warn("Initial sync/clear failed (safe to ignore if index missing): " + e.getMessage());
            }
        } catch (Exception e) {
            // double safety
        }

        for (int i = 0; i < TARGET_INCIDENT_COUNT; i++) {
            Incident incident = generateRealisticIncident();

            // Create a correlated deployment for 40% of incidents to show off the feature
            if (random.nextInt(100) < 40) {
                createPrecedingDeployment(incident);
            }

            try {
                incidentService.createIncident(incident);
            } catch (Exception e) {
                logger.error("Failed to generate sample incident", e);
            }
        }

        // Create the specific demo incident "noc-123" for the Causality Graph demo
        createDemoIncident();

        logger.info("Completed sample data generation. Dashboard is ready.");
    }

    private void createDemoIncident() {
        try {
            if (incidentRepository.findByPublicId("noc-123").isPresent()) {
                return;
            }

            Incident incident = new Incident();
            incident.setPublicId("noc-123");
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

            incidentService.createIncident(incident);
            logger.info("Seeded demo incident: noc-123");
        } catch (Exception e) {
            logger.error("Failed to seed demo incident noc-123", e);
        }
    }

    private void createPrecedingDeployment(Incident incident) {
        try {
            com.loom.integration.cicd.Deployment d = new com.loom.integration.cicd.Deployment();
            d.setServiceName(incident.getService());
            d.setEnvironment("prod");
            // Deployment happened 5-45 minutes before the incident
            d.setDeploymentTime(incident.getCreatedAt().minus(5 + random.nextInt(40), ChronoUnit.MINUTES));
            d.setRepoName("github.com/loom/" + incident.getService());
            d.setBranch("main");
            d.setAuthor(ASSIGNEES.get(random.nextInt(ASSIGNEES.size())).split(" ")[0].toLowerCase());
            d.setCommitHash(java.util.UUID.randomUUID().toString().replace("-", ""));
            d.setCommitMessage("feat: update " + incident.getService() + " logic for better performance");
            d.setStatus("success");

            deploymentRepository.save(d);
        } catch (Exception e) {
            logger.warn("Failed to create dummy deployment", e);
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
