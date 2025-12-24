package com.loom.sentinel.pulse;

import com.loom.incident.domain.Incident;
import com.loom.incident.domain.Severity;
import com.loom.incident.domain.IncidentStatus;
import com.loom.incident.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PulseService {

    private final IncidentRepository incidentRepository;
    private final List<Engineer> mockEngineers;

    public PulseService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
        this.mockEngineers = new ArrayList<>();
        initializeMockEngineers();
    }

    private void initializeMockEngineers() {
        mockEngineers.add(new Engineer("Alice Network", "SRE Lead",
                "https://ui-avatars.com/api/?name=Alice+Network&background=random"));
        mockEngineers.add(
                new Engineer("Bob Database", "DBA", "https://ui-avatars.com/api/?name=Bob+Database&background=random"));
        mockEngineers.add(new Engineer("Charlie Frontend", "Frontend Dev",
                "https://ui-avatars.com/api/?name=Charlie+Frontend&background=random"));
        mockEngineers.add(new Engineer("Dave Backend", "Backend Dev",
                "https://ui-avatars.com/api/?name=Dave+Backend&background=random"));
    }

    public PulseResponse getPulseData() {
        // 1. Calculate Engineer Metrics
        for (Engineer engineer : mockEngineers) {
            calculateMetrics(engineer);
        }

        // 2. Calculate Team Metrics
        List<TeamHealth> teams = calculateTeamHealth(mockEngineers);

        // 3. Generate Systemic Signals (Mock Logic for now)
        List<SystemicSignal> signals = generateSystemicSignals(mockEngineers);

        // 4. Calculate Org Load Index
        double orgLoad = mockEngineers.stream().mapToDouble(Engineer::getCurrentLoadScore).average().orElse(0.0);

        return new PulseResponse(mockEngineers, teams, signals, orgLoad);
    }

    private void calculateMetrics(Engineer engineer) {
        List<Incident> incidents = incidentRepository.findByAssigneeName(engineer.getName());

        // Filter for active incidents
        List<Incident> activeIncidents = incidents.stream()
                .filter(i -> i.getStatus() == IncidentStatus.OPEN || i.getStatus() == IncidentStatus.INVESTIGATING)
                .collect(Collectors.toList());

        int activeCount = activeIncidents.size();
        engineer.setActiveIncidents(activeCount);

        // Mock project assignment based on hash of name
        int projects = (engineer.getName().length() % 3) + 1;
        engineer.setAssignedProjects(projects);

        // Calculate Load Score (0.0 - 1.0)
        double rawLoad = (activeCount * 0.15) + (projects * 0.1);
        double loadScore = Math.min(1.0, Math.max(0.0, rawLoad));
        engineer.setCurrentLoadScore(Math.round(loadScore * 100.0) / 100.0);

        // Calculate Burnout Risk
        long sev1Count = activeIncidents.stream().filter(i -> i.getSeverity() == Severity.SEV1).count();
        double risk = loadScore + (sev1Count * 0.2);
        if (sev1Count > 0)
            risk += 0.1;
        engineer.setBurnoutRisk(Math.min(1.0, Math.round(risk * 100.0) / 100.0));

        // Mock Trend History (Random walk based on current load)
        List<Double> history = new ArrayList<>();
        double current = loadScore;
        for (int i = 0; i < 14; i++) {
            history.add(0, Math.min(1.0, Math.max(0.0, current)));
            current += (Math.random() - 0.5) * 0.2; // fluctuate
        }
        engineer.setTrendHistory(history);

        // Mock Interruptions
        engineer.setDailyInterruptions(Math.round((activeCount * 2.5 + projects * 1.5) * 10.0) / 10.0);

        // Mock Team ID
        engineer.setTeamId(engineer.getRole().contains("SRE") ? "SRE" : "Product");

        // Generate Narrative
        engineer.setStatusNarrative(generateNarrative(engineer, sev1Count));
    }

    private List<TeamHealth> calculateTeamHealth(List<Engineer> engineers) {
        // Simple aggregation by mocked team ID
        List<TeamHealth> teams = new ArrayList<>();

        // SRE Team
        teams.add(aggregateTeam("SRE", "SRE Platform", engineers));
        // Product Team
        teams.add(aggregateTeam("Product", "Product Engineering", engineers));

        return teams;
    }

    private TeamHealth aggregateTeam(String teamId, String name, List<Engineer> allEngineers) {
        List<Engineer> teamMembers = allEngineers.stream()
                .filter(e -> teamId.equals(e.getTeamId()))
                .collect(Collectors.toList());

        if (teamMembers.isEmpty())
            return new TeamHealth(teamId, name, 0, 0, 0, List.of(0.0, 0.0, 0.0));

        double avgLoad = teamMembers.stream().mapToDouble(Engineer::getCurrentLoadScore).average().orElse(0);
        int totalIncidents = teamMembers.stream().mapToInt(Engineer::getActiveIncidents).sum();
        double riskScore = teamMembers.stream().mapToDouble(Engineer::getBurnoutRisk).max().orElse(0); // Max risk
                                                                                                       // drives team
                                                                                                       // risk

        // Load Distrib: Low (<0.4), Med (0.4-0.7), High (>0.7)
        long low = teamMembers.stream().filter(e -> e.getCurrentLoadScore() < 0.4).count();
        long med = teamMembers.stream().filter(e -> e.getCurrentLoadScore() >= 0.4 && e.getCurrentLoadScore() <= 0.7)
                .count();
        long high = teamMembers.stream().filter(e -> e.getCurrentLoadScore() > 0.7).count();
        double total = teamMembers.size();

        return new TeamHealth(teamId, name, avgLoad, totalIncidents, riskScore,
                List.of(low / total, med / total, high / total));
    }

    private List<SystemicSignal> generateSystemicSignals(List<Engineer> engineers) {
        List<SystemicSignal> signals = new ArrayList<>();

        // Mock logic for demo
        double avgRisk = engineers.stream().mapToDouble(Engineer::getBurnoutRisk).average().orElse(0);

        if (avgRisk > 0.5) {
            signals.add(new SystemicSignal("SIG-001", "Deployment Frequency Correlation",
                    "Risk levels correlate 90% with Friday deployments over the last month.", "CORRELATION", "HIGH"));
        }

        signals.add(new SystemicSignal("SIG-002", "Context Switching Fatigue",
                "Avg interruptions exceeded optimal threshold (4/day) for SRE team.", "WARNING", "MEDIUM"));

        return signals;
    }

    private String generateNarrative(Engineer e, long sev1Count) {
        if (e.getBurnoutRisk() > 0.8) {
            return "High risk. " + e.getName() + " is handling " + sev1Count + " SEV1 incidents + "
                    + e.getAssignedProjects() + " projects.";
        } else if (e.getCurrentLoadScore() > 0.6) {
            return "Moderate load. High context switching overhead detected.";
        } else {
            return "Optimal range. Capacity available for planned work.";
        }
    }
}
