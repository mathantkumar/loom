package com.loom.sentinel;

import com.loom.incident.domain.Incident;
import com.loom.incident.domain.IncidentStatus;
import com.loom.incident.domain.IssueType;
import com.loom.incident.domain.Severity;
import com.loom.incident.repository.IncidentRepository;
import com.loom.incident.service.IncidentService;
import com.loom.sentinel.pulse.PulseResponse;
import com.loom.sentinel.pulse.PulseService;
import com.loom.sentinel.pulse.SystemicSignal;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SentinelAlertService {

    private final PulseService pulseService;
    private final IncidentService incidentService;
    private final IncidentRepository incidentRepository;

    public SentinelAlertService(PulseService pulseService, IncidentService incidentService,
            IncidentRepository incidentRepository) {
        this.pulseService = pulseService;
        this.incidentService = incidentService;
        this.incidentRepository = incidentRepository;
    }

    // Run every hour to check for new systemic risks
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void monitorSentinelSignals() {
        System.out.println("[Sentinel] Running periodic signal check...");

        PulseResponse pulseData = pulseService.getPulseData();
        List<SystemicSignal> signals = pulseData.getSystemicSignals();

        System.out.println("[Sentinel] Found " + signals.size() + " signals.");

        for (SystemicSignal signal : signals) {
            System.out.println(
                    "[Sentinel] Inspecting Signal: " + signal.getId() + " | Confidence: " + signal.getConfidence());
            if ("HIGH".equalsIgnoreCase(signal.getConfidence())) {
                createIncidentIfNew(signal);
            }
        }
    }

    private void createIncidentIfNew(SystemicSignal signal) {
        String incidentTitle = "[Sentinel] High Risk Detected: " + signal.getTitle();

        // Check for duplicates (simple check by title for open incidents)
        boolean exists = incidentRepository.findAll().stream()
                .anyMatch(i -> i.getTitle().equals(incidentTitle) &&
                        (i.getStatus() == IncidentStatus.OPEN || i.getStatus() == IncidentStatus.INVESTIGATING));

        if (!exists) {
            System.out.println("[Sentinel] Creating auto-incident for signal: " + signal.getId());

            Incident incident = new Incident();
            incident.setTitle(incidentTitle);
            incident.setDescription("Sentinel has detected a systemic issue.\n\n" +
                    "Signal ID: " + signal.getId() + "\n" +
                    "Reason: " + signal.getDescription() + "\n" +
                    "Type: " + signal.getType() + "\n" +
                    "Confidence: " + signal.getConfidence());

            incident.setSeverity(Severity.SEV2); // Default to SEV2 for systemic risks
            incident.setStatus(IncidentStatus.OPEN);
            incident.setService("Loom Sentinel"); // Attributed to the sentinel system itself
            incident.setIssueType(IssueType.PROCESS_FAILURE); // Default issue type

            incidentService.createIncident(incident);
        } else {
            System.out.println("[Sentinel] Active incident already exists for signal: " + signal.getId());
        }
    }
}
