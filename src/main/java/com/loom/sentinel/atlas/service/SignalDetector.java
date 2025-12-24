package com.loom.sentinel.atlas.service;

import com.loom.incident.domain.Incident;
import com.loom.incident.domain.Severity;
import com.loom.incident.repository.IncidentRepository;
import com.loom.integration.cicd.Deployment;
import com.loom.integration.cicd.DeploymentRepository;
import com.loom.sentinel.atlas.model.AtlasSignal;
import com.loom.sentinel.atlas.model.AtlasSignal.SignalType;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class SignalDetector {

    private final IncidentRepository incidentRepository;
    private final DeploymentRepository deploymentRepository;

    public SignalDetector(IncidentRepository incidentRepository, DeploymentRepository deploymentRepository) {
        this.incidentRepository = incidentRepository;
        this.deploymentRepository = deploymentRepository;
    }

    public List<AtlasSignal> detectSignals(String projectId) {
        // Project ID is treated as Service Name for MVP
        List<AtlasSignal> signals = new ArrayList<>();
        Instant twentyFourHoursAgo = Instant.now().minus(24, ChronoUnit.HOURS);

        // 1. Detect Incident Signals
        List<Incident> recentIncidents = incidentRepository.findByServiceAndCreatedAtAfter(projectId,
                twentyFourHoursAgo);

        // a. Volume Spike
        if (recentIncidents.size() > 5) {
            signals.add(new AtlasSignal(
                    UUID.randomUUID().toString(),
                    SignalType.INCIDENT_VOLUME_SPIKE,
                    projectId,
                    Instant.now(),
                    Math.min(recentIncidents.size() / 10.0, 1.0),
                    Map.of("count", String.valueOf(recentIncidents.size()))));
        }

        // b. Severity Signals
        for (Incident incident : recentIncidents) {
            if (incident.getSeverity() == Severity.SEV1) {
                signals.add(new AtlasSignal(
                        UUID.randomUUID().toString(),
                        SignalType.INCIDENT_SEVERITY,
                        incident.getId().toString(),
                        incident.getCreatedAt(),
                        1.0,
                        Map.of("severity", "SEV1", "title", incident.getTitle())));
            }
        }

        // 2. Detect Deployment Signals
        // Check both prod and staging or just all environments
        // We might need a repo method without environment, but for now let's try 'prod'
        List<Deployment> recentDeployments = deploymentRepository.findByServiceNameAndEnvironmentAndDeploymentTimeAfter(
                projectId, "prod", twentyFourHoursAgo);

        for (Deployment deploy : recentDeployments) {
            if (!"success".equalsIgnoreCase(deploy.getStatus())) {
                signals.add(new AtlasSignal(
                        UUID.randomUUID().toString(),
                        SignalType.DEPLOYMENT_FAILURE,
                        deploy.getId().toString(),
                        deploy.getDeploymentTime(),
                        0.8,
                        Map.of("version", deploy.getCommitHash(), "error", "Deployment failed")));
            }
        }

        return signals;
    }
}
