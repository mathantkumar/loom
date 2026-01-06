package com.loom.incident.service;

import com.loom.incident.domain.Incident;
import com.loom.incident.domain.IncidentStatus;
import com.loom.incident.repository.IncidentRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class EscalationService {

    private final IncidentRepository incidentRepository;
    private final Random random = new Random();

    public EscalationService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public static class EscalationResponse {
        public String assigneeName;
        public String assigneeAvatar;
        public String eta;
        public String status;
        public String deepAnalysisId;
    }

    @Transactional
    public EscalationResponse escalateToOnCall(String incidentIdStr) {
        Incident incident = findIncident(incidentIdStr);

        // 1. Determine On-Call SRE (Simulated)
        String[] sres = { "Sarah K", "Mike R", "Alex T", "Priya P" };
        String assignee = sres[random.nextInt(sres.length)];
        String avatar = "https://ui-avatars.com/api/?name=" + assignee.replace(" ", "+")
                + "&background=0D8ABC&color=fff";
        String eta = "~2 min";

        // 2. Update Incident
        incident.setAssigneeName(assignee);
        incident.setAssigneeAvatar(avatar);
        incident.setStatus(IncidentStatus.INVESTIGATING); // Maps to "Under Investigation (AI + Human)" contextually
        incidentRepository.save(incident);

        // 3. Trigger Async AI Deep Analysis
        String deepAnalysisId = UUID.randomUUID().toString();
        triggerAsyncDeepAnalysis(incident, deepAnalysisId);

        // 4. Return Response
        EscalationResponse response = new EscalationResponse();
        response.assigneeName = assignee;
        response.assigneeAvatar = avatar;
        response.eta = eta;
        response.status = "INVESTIGATING";
        response.deepAnalysisId = deepAnalysisId;

        return response;
    }

    private Incident findIncident(String incidentIdStr) {
        try {
            return incidentRepository.findById(UUID.fromString(incidentIdStr))
                    .orElseThrow(() -> new RuntimeException("Incident not found"));
        } catch (IllegalArgumentException e) {
            return incidentRepository.findByPublicId(incidentIdStr)
                    .orElseThrow(() -> new RuntimeException("Incident not found"));
        }
    }

    @Async
    public CompletableFuture<Void> triggerAsyncDeepAnalysis(Incident incident, String analysisId) {
        // In a real system, this would trigger a Temporal workflow or Kafka event.
        // For MVP, we simulate a delay then "completing" the analysis context.
        return CompletableFuture.runAsync(() -> {
            try {
                // Simulate "Expanding logs" and "Correlating metrics"
                Thread.sleep(2000);
                // System.out.println("AI Deep Analysis " + analysisId + " started for " +
                // incident.getTitle());
                // Logic to generate detailed report would go here
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
    }
}
