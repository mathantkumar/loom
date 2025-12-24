package com.loom.integration.cicd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DeploymentService {

    private final DeploymentRepository deploymentRepository;

    @Autowired
    public DeploymentService(DeploymentRepository deploymentRepository) {
        this.deploymentRepository = deploymentRepository;
    }

    @Transactional
    public Deployment saveDeployment(Deployment deployment) {
        if (deployment.getDeploymentTime() == null) {
            deployment.setDeploymentTime(Instant.now());
        }
        return deploymentRepository.save(deployment);
    }

    public List<Deployment> findRecentDeployments(String serviceName, String environment) {
        Instant twoHoursAgo = Instant.now().minus(2, ChronoUnit.HOURS);
        return deploymentRepository.findByServiceNameAndEnvironmentAndDeploymentTimeAfter(
                serviceName, environment, twoHoursAgo);
    }
}
