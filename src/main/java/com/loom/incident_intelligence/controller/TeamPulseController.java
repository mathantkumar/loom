package com.loom.incident_intelligence.controller;

import com.loom.incident.domain.Incident;
import com.loom.incident.domain.IncidentStatus;
import com.loom.incident.domain.Severity;
import com.loom.incident.repository.IncidentRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/pulse")
public class TeamPulseController {

    private final IncidentRepository incidentRepository;

    public TeamPulseController(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @GetMapping("/team-load")
    public List<EngineerPulse> getTeamLoad() {
        // Fetch all incidents (in a real app, filters by date/status would improve
        // perf)
        List<Incident> allIncidents = incidentRepository.findAll();

        // Group by Assignee
        Map<String, List<Incident>> incidentsByAssignee = allIncidents.stream()
                .filter(i -> i.getAssigneeName() != null && !i.getAssigneeName().isEmpty())
                .collect(Collectors.groupingBy(Incident::getAssigneeName));

        List<EngineerPulse> result = new ArrayList<>();
        int idCounter = 1;

        for (Map.Entry<String, List<Incident>> entry : incidentsByAssignee.entrySet()) {
            String assigneeName = entry.getKey();
            List<Incident> incidents = entry.getValue();

            // 1. Calculate Active Load
            List<Incident> activeIncidents = incidents.stream()
                    .filter(i -> i.getStatus() != IncidentStatus.RESOLVED)
                    .collect(Collectors.toList());

            double loadScore = calculateLoadScore(activeIncidents);

            // 2. Identify Status
            String status = determineStatus(loadScore, activeIncidents);

            // 3. Determine Role (Naive heuristic based on history, or just 'Engineer')
            String role = "Software Engineer";
            if (activeIncidents.stream()
                    .anyMatch(i -> i.getService().contains("db") || i.getService().contains("data"))) {
                role = "Database Engineer";
            } else if (activeIncidents.stream()
                    .anyMatch(i -> i.getService().contains("net") || i.getService().contains("infra"))) {
                role = "SRE / Infrastructure";
            }

            // 4. Calculate Mastered Services (Services with most RESOLVED incidents)
            List<String> masteredServices = incidents.stream()
                    .filter(i -> i.getStatus() == IncidentStatus.RESOLVED)
                    .collect(Collectors.groupingBy(Incident::getService, Collectors.counting()))
                    .entrySet().stream()
                    .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                    .limit(3)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());

            // 5. Recent Active Incident Details
            List<IncidentSummary> activeSummaries = activeIncidents.stream()
                    .map(i -> new IncidentSummary(
                            i.getPublicId(),
                            i.getTitle(),
                            i.getSeverity().name(),
                            i.getService()))
                    .collect(Collectors.toList());

            // 6. Stats
            long sev1Count = activeIncidents.stream().filter(i -> i.getSeverity() == Severity.SEV1).count();
            long sev2Count = activeIncidents.stream().filter(i -> i.getSeverity() == Severity.SEV2).count();
            long sev3Count = activeIncidents.stream().filter(i -> i.getSeverity() == Severity.SEV3).count();

            // Build Response Object
            EngineerPulse pulse = new EngineerPulse();
            pulse.setId(String.valueOf(idCounter++));
            pulse.setName(assigneeName);
            pulse.setRole(role);
            pulse.setAvatarInitials(getInitials(assigneeName));
            pulse.setStatus(status);
            pulse.setActiveLoadScore(Math.min(10, (int) loadScore));
            pulse.setActiveIncidents(activeIncidents.size());
            pulse.setSeverityBreakdown(new SeverityBreakdown((int) sev1Count, (int) sev2Count, (int) sev3Count));
            pulse.setContextSwitchingScore(
                    activeIncidents.size() > 3 ? "High" : activeIncidents.size() > 1 ? "Medium" : "Low");
            pulse.setBurnoutRisk(loadScore > 8);
            pulse.setDecisionFatigueRisk(loadScore > 6);

            // New dynamic fields
            pulse.setMasteredServices(masteredServices);
            pulse.setRecentIncidents(activeSummaries);

            result.add(pulse);
        }

        return result.stream()
                .sorted((a, b) -> Integer.compare(b.getActiveLoadScore(), a.getActiveLoadScore())) // Sort by highest
                                                                                                   // load
                .collect(Collectors.toList());
    }

    private double calculateLoadScore(List<Incident> active) {
        double score = 0;
        for (Incident i : active) {
            switch (i.getSeverity()) {
                case SEV1:
                    score += 5;
                    break;
                case SEV2:
                    score += 3;
                    break;
                case SEV3:
                    score += 1;
                    break;
                default:
                    score += 0.5;
                    break; // SEV4 fallback
            }
        }
        return score;
    }

    private String determineStatus(double loadScore, List<Incident> active) {
        if (loadScore >= 8)
            return "Overloaded";
        if (loadScore >= 4)
            return "On-call";
        if (!active.isEmpty())
            return "In flow";
        return "Stable";
    }

    private String getInitials(String name) {
        if (name == null || name.isEmpty())
            return "?";
        String[] parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        }
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }

    // --- DTOs ---

    public static class EngineerPulse {
        public String id;
        public String name;
        public String role;
        public String avatarInitials;
        public String status;
        public int activeLoadScore;
        public int activeIncidents;
        public SeverityBreakdown severityBreakdown;
        public String contextSwitchingScore;
        public boolean burnoutRisk;
        public boolean decisionFatigueRisk;
        public List<String> masteredServices;
        public List<IncidentSummary> recentIncidents;

        // Getters/Setters needed for Jackson serialization
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getAvatarInitials() {
            return avatarInitials;
        }

        public void setAvatarInitials(String avatarInitials) {
            this.avatarInitials = avatarInitials;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public int getActiveLoadScore() {
            return activeLoadScore;
        }

        public void setActiveLoadScore(int activeLoadScore) {
            this.activeLoadScore = activeLoadScore;
        }

        public int getActiveIncidents() {
            return activeIncidents;
        }

        public void setActiveIncidents(int activeIncidents) {
            this.activeIncidents = activeIncidents;
        }

        public SeverityBreakdown getSeverityBreakdown() {
            return severityBreakdown;
        }

        public void setSeverityBreakdown(SeverityBreakdown severityBreakdown) {
            this.severityBreakdown = severityBreakdown;
        }

        public String getContextSwitchingScore() {
            return contextSwitchingScore;
        }

        public void setContextSwitchingScore(String contextSwitchingScore) {
            this.contextSwitchingScore = contextSwitchingScore;
        }

        public boolean isBurnoutRisk() {
            return burnoutRisk;
        }

        public void setBurnoutRisk(boolean burnoutRisk) {
            this.burnoutRisk = burnoutRisk;
        }

        public boolean isDecisionFatigueRisk() {
            return decisionFatigueRisk;
        }

        public void setDecisionFatigueRisk(boolean decisionFatigueRisk) {
            this.decisionFatigueRisk = decisionFatigueRisk;
        }

        public List<String> getMasteredServices() {
            return masteredServices;
        }

        public void setMasteredServices(List<String> masteredServices) {
            this.masteredServices = masteredServices;
        }

        public List<IncidentSummary> getRecentIncidents() {
            return recentIncidents;
        }

        public void setRecentIncidents(List<IncidentSummary> recentIncidents) {
            this.recentIncidents = recentIncidents;
        }
    }

    public static class SeverityBreakdown {
        public int sev1;
        public int sev2;
        public int sev3;

        public SeverityBreakdown(int sev1, int sev2, int sev3) {
            this.sev1 = sev1;
            this.sev2 = sev2;
            this.sev3 = sev3;
        }

        // Getters/Setters
        public int getSev1() {
            return sev1;
        }

        public int getSev2() {
            return sev2;
        }

        public int getSev3() {
            return sev3;
        }
    }

    public static class IncidentSummary {
        public String id;
        public String title;
        public String severity;
        public String service;

        public IncidentSummary(String id, String title, String severity, String service) {
            this.id = id;
            this.title = title;
            this.severity = severity;
            this.service = service;
        }

        // Getters/Setters
        public String getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public String getSeverity() {
            return severity;
        }

        public String getService() {
            return service;
        }
    }
}
