package com.loom.incident.config;

import com.loom.incident.domain.Incident;
import com.loom.incident.domain.IncidentStatus;
import com.loom.incident.domain.Severity;
import com.loom.incident.repository.IncidentRepository;
import com.loom.sentinel.log.model.LogEntry;
import com.loom.sentinel.log.repository.LogRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedData(LogRepository logRepository, IncidentRepository incidentRepository) {
        return args -> {
            // Check if we have logs for inventory-service
            long logCount = 0;
            try {
                logCount = logRepository.count();
            } catch (Exception e) {
                // Elasticsearch might not be ready or index doesn't exist
            }

            if (logCount == 0) {
                System.out.println("Seeding demo data for Sentinel Diagnosis...");
                Instant now = Instant.now();

                // --- Scenario 1: Inventory Service (Memory Leak) ---
                createScenario(incidentRepository, logRepository, now,
                        "inventory-service",
                        "High latency in Inventory Service",
                        "java.lang.OutOfMemoryError: Java heap space",
                        "java.lang.OutOfMemoryError: Java heap space\n\tat com.loom.inventory.Cache.load(Cache.java:120)",
                        50);

                // --- Scenario 2: Payment Service (Gateway Timeout) ---
                createScenario(incidentRepository, logRepository, now,
                        "payment-service",
                        "Payment Gateway Timeouts",
                        "java.net.SocketTimeoutException: Read timed out",
                        "java.net.SocketTimeoutException: Read timed out\n\tat com.loom.payment.gateway.StripeClient.charge(StripeClient.java:88)",
                        30);

                // --- Scenario 3: User Service (Database Connection) ---
                createScenario(incidentRepository, logRepository, now,
                        "user-service",
                        "User Login Failures",
                        "org.postgresql.util.PSQLException: FATAL: remaining connection slots are reserved for non-replication superuser connections",
                        "org.postgresql.util.PSQLException: FATAL: ...\n\tat com.loom.user.repo.UserRepository.findByEmail(UserRepository.java:45)",
                        40);

                // --- Scenario 4: Notification Service (Healthy but noisy) ---
                // No incident, just logs
                seedLogs(logRepository, now, "notification-service", "INFO", "Email sent successfully", 100);
            }
        };
    }

    private void createScenario(IncidentRepository incidentRepository, LogRepository logRepository, Instant now,
            String service, String title, String errorMsg, String stackTrace, int errorCount) {

        // 1. Create/Update Incident
        try {
            incidentRepository.findAll().stream()
                    .filter(i -> service.equals(i.getService()) &&
                            i.getStatus() != IncidentStatus.RESOLVED)
                    .findFirst()
                    .ifPresentOrElse(
                            existing -> {
                                existing.setCreatedAt(now);
                                incidentRepository.save(existing);
                                System.out.println("Refreshed timestamp for: " + title);
                            },
                            () -> {
                                Incident incident = new Incident();
                                incident.setTitle(title);
                                incident.setDescription("Automated alert for " + service);
                                incident.setService(service);
                                incident.setSeverity(Severity.SEV1);
                                incident.setStatus(IncidentStatus.OPEN);
                                incident.setPublicId("INC-" + (System.currentTimeMillis() % 10000));
                                incidentRepository.save(incident);
                                System.out.println("Created demo incident: " + title);
                            });
        } catch (Exception e) {
            System.out.println("Error managing incident for " + service + ": " + e.getMessage());
        }

        // 2. Seed Error Logs
        for (int i = 0; i < errorCount; i++) {
            Instant logTime = now.minus(30 - (i % 30), ChronoUnit.MINUTES);
            LogEntry log = new LogEntry();
            log.setId(UUID.randomUUID().toString());
            log.setTimestamp(logTime);
            log.setService(service);
            log.setLevel("ERROR");
            log.setMessage(errorMsg);
            log.setStackTrace(stackTrace);
            logRepository.save(log);
        }

        // 3. Seed Success Logs (Noise)
        seedLogs(logRepository, now, service, "INFO", "Health check passed", 50);
    }

    private void seedLogs(LogRepository repo, Instant now, String service, String level, String msg, int count) {
        for (int i = 0; i < count; i++) {
            Instant logTime = now.minus(30 - (i % 30), ChronoUnit.MINUTES);
            LogEntry log = new LogEntry();
            log.setId(UUID.randomUUID().toString());
            log.setTimestamp(logTime);
            log.setService(service);
            log.setLevel(level);
            log.setMessage(msg);
            repo.save(log);
        }
    }
}
