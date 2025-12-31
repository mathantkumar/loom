package com.loom.sentinel.log.service;

import com.loom.sentinel.log.model.LogEntry;
import com.loom.sentinel.log.repository.LogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class SampleLogGeneratorService {

    private static final Logger logger = LoggerFactory.getLogger(SampleLogGeneratorService.class);
    private final LogRepository logRepository;
    private final Random random = new Random();

    public SampleLogGeneratorService(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        if (logRepository.count() == 0) {
            logger.info("Initializing sample logs (48h history)...");
            generateLogs(48);
            logger.info("Sample logs generated.");
        }
    }

    public void generateLogs(int hoursBack) {
        Instant endTime = Instant.now();
        Instant startTime = endTime.minus(hoursBack, ChronoUnit.HOURS);
        List<LogEntry> batch = new ArrayList<>();

        String[] services = { "payment-service", "inventory-service", "user-service" };
        String[] versions = { "v2.3.0", "v2.3.1" }; // v2.3.1 is the problematic one

        Instant current = startTime;
        while (current.isBefore(endTime)) {
            // Simulate traffic
            for (String service : services) {
                // Base load: 1-5 logs per second per service
                int numLogs = random.nextInt(5) + 1;

                // Determine version (simulate deployment halfway through)
                String version = versions[0];
                if (current.isAfter(endTime.minus(2, ChronoUnit.HOURS)) && service.equals("payment-service")) {
                    // Payment service updated 2 hours ago
                    version = versions[1];
                }

                for (int i = 0; i < numLogs; i++) {
                    batch.add(createNormalLog(current, service, version));
                }

                // Inject Errors for Payment Service with new version
                if (version.equals("v2.3.1") && service.equals("payment-service")) {
                    if (random.nextDouble() < 0.15) { // 15% error rate
                        batch.add(createErrorLog(current, service, version));
                    }
                }
            }

            // Advance time by ~1 second
            current = current.plusMillis(1000 + random.nextInt(500));

            if (batch.size() > 1000) {
                logRepository.saveAll(batch);
                batch.clear();
            }
        }
        if (!batch.isEmpty()) {
            logRepository.saveAll(batch);
        }
    }

    private LogEntry createNormalLog(Instant timestamp, String service, String version) {
        LogEntry log = new LogEntry();
        log.setId(UUID.randomUUID().toString());
        log.setTimestamp(timestamp);
        log.setService(service);
        log.setLevel("INFO");
        log.setDeploymentVersion(version);
        log.setTraceId(UUID.randomUUID().toString());

        String[] actions = { "Processing payment", "Validating user", "Checking inventory", "Health check OK" };
        log.setMessage(actions[random.nextInt(actions.length)] + " - " + UUID.randomUUID().toString().substring(0, 8));

        return log;
    }

    private LogEntry createErrorLog(Instant timestamp, String service, String version) {
        LogEntry log = new LogEntry();
        log.setId(UUID.randomUUID().toString());
        log.setTimestamp(timestamp);
        log.setService(service);
        log.setLevel("ERROR");
        log.setDeploymentVersion(version);
        log.setTraceId(UUID.randomUUID().toString());

        // Memory Leak Pattern
        if (random.nextBoolean()) {
            log.setMessage("java.lang.OutOfMemoryError: Java heap space");
            log.setStackTrace(
                    "java.lang.OutOfMemoryError: Java heap space\n\tat com.loom.payment.cache.TransactionCache.put(TransactionCache.java:124)\n\tat com.loom.payment.service.PaymentProcessor.process(PaymentProcessor.java:56)");
        } else {
            // DB Timeout Pattern
            log.setMessage("ConnectionTimeoutException: Database pool exhausted");
            log.setStackTrace(
                    "com.loom.db.ConnectionTimeoutException: Database pool exhausted\n\tat com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:180)\n\tat com.loom.payment.repository.PaymentRepository.save(PaymentRepository.java:45)");
        }

        return log;
    }
}
