package com.loom.incident.loader;

import com.loom.incident.domain.Incident;
import com.loom.incident.service.IncidentIndexService;
import com.loom.incident.domain.IncidentStatus;
import com.loom.incident.domain.IssueType;
import com.loom.incident.domain.Severity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Configuration
@Profile("!test")
public class SyntheticIncidentLoader {

        private static final Logger logger = LoggerFactory.getLogger(SyntheticIncidentLoader.class);

        @Bean
        CommandLineRunner loadSyntheticData(IncidentIndexService incidentIndexService) {
                return args -> {
                        logger.info("Initializing Synthetic Data Loader...");

                        List<Incident> incidents = generateSyntheticIncidents();

                        int count = 0;
                        for (Incident incident : incidents) {
                                // In a real app we would check existence, but for MVP Hard Reset we just
                                // re-index
                                // IndexService should handle idempotency if ID matches (which we set manually
                                // here)
                                // But wait, we set internal ID random every time in createIncident.
                                // However, user forced index deletion on startup in IncidentIndexService, so
                                // this is fine.
                                incidentIndexService.indexIncidentAsync(incident);
                                count++;
                        }
                        logger.info("Loaded {} synthetic incidents into Elasticsearch.", count);
                };
        }

        private List<Incident> generateSyntheticIncidents() {
                List<Incident> list = new ArrayList<>();
                Instant now = Instant.now();

                // --- Payment Service Incidents ---
                list.add(createIncident(
                                "PAY-001", "payment-service", "Payment Gateway Timeout 504",
                                "High latency in upstream payment provider callback detected during peak load.",
                                "Upstream provider acknowledged network stutter. Retries exhausted connection pool.",
                                IncidentStatus.RESOLVED, Severity.SEV2, IssueType.INFRASTRUCTURE,
                                now.minus(2, ChronoUnit.DAYS)));
                list.add(createIncident(
                                "PAY-002", "payment-service", "Double Charge Anomaly",
                                "Users reporting duplicate transactions for same orderID.",
                                "Idempotency key missing in retry logic for 'capture_charge' endpoint.",
                                IncidentStatus.RESOLVED, Severity.SEV1, IssueType.API, now.minus(5, ChronoUnit.DAYS)));
                list.add(createIncident(
                                "PAY-003", "payment-service", "Fraud Check Latency Spike",
                                "Checkout flow stalling at 'Verifying...' step.",
                                "ML model inference endpoint scaling group failed to scale up.",
                                IncidentStatus.RESOLVED, Severity.SEV3, IssueType.PERFORMANCE,
                                now.minus(10, ChronoUnit.DAYS)));

                // --- Auth Service Incidents ---
                list.add(createIncident(
                                "AUTH-001", "auth-service", "JWT Validation Error 401",
                                "Valid tokens being rejected intermittently across all regions.",
                                "Signing key rotation desync between issuer and validator services.",
                                IncidentStatus.RESOLVED, Severity.SEV1, IssueType.SECURITY,
                                now.minus(1, ChronoUnit.DAYS)));
                list.add(createIncident(
                                "AUTH-002", "auth-service", "Login Rate Limit False Positives",
                                "Legitimate users from corporate VPNs blocked by rate limiter.",
                                "Rate limiter IP aggregation logic did not account for NAT gateways.",
                                IncidentStatus.RESOLVED, Severity.SEV3, IssueType.NETWORK,
                                now.minus(3, ChronoUnit.DAYS)));

                // --- Inventory Service Incidents ---
                list.add(createIncident(
                                "INV-001", "inventory-service", "Stock Count Mismatch",
                                "Frontend shows 'In Stock' but checkout fails with 'Out of Stock'.",
                                "Redis cache invalidation race condition during high-concurrency writes.",
                                IncidentStatus.RESOLVED, Severity.SEV2, IssueType.DATABASE,
                                now.minus(4, ChronoUnit.DAYS)));
                list.add(createIncident(
                                "INV-002", "inventory-service", "Slow SKU Search",
                                "Search queries taking > 2s for wildcard patterns.",
                                "Missing N-gram index on product description field.",
                                IncidentStatus.RESOLVED, Severity.SEV4, IssueType.PERFORMANCE,
                                now.minus(12, ChronoUnit.DAYS)));

                // --- Checkout Service (Dependency) ---
                list.add(createIncident(
                                "CHK-001", "checkout-service", "Cart Abandonment Spike",
                                "40% drop in checkout completion rate observed.",
                                "Cascading failure from payment-service timeout (PAY-001).",
                                IncidentStatus.RESOLVED, Severity.SEV2, IssueType.INFRASTRUCTURE,
                                now.minus(2, ChronoUnit.DAYS)));

                // --- Demo Mock Incident (for MVP) ---
                // Ensuring 'noc-123' exists for frontend/demo defaults
                list.add(createIncident(
                                "noc-123", "auth-service", "Unexpected High Error Rate in Auth",
                                "Spike in 500 errors on /login endpoint.",
                                "Database connection pool saturation due to unoptimized query.",
                                IncidentStatus.RESOLVED, Severity.SEV1, IssueType.DATABASE,
                                now.minus(1, ChronoUnit.DAYS)));

                return list;
        }

        private Incident createIncident(String publicId, String service, String title, String desc,
                        String rootCause, IncidentStatus status, Severity severity,
                        IssueType type, Instant created) {
                Incident i = new Incident();
                i.setId(UUID.randomUUID()); // Internal ID
                i.setPublicId(publicId); // Friendly ID
                i.setService(service);
                i.setTitle(title);
                i.setDescription(desc);
                i.setRootCause(rootCause);
                i.setStatus(status);
                i.setSeverity(severity);
                i.setIssueType(type);
                i.setCreatedAt(created);
                i.setResolvedAt(created.plus(2, ChronoUnit.HOURS));
                return i;
        }
}
