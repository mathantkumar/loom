package com.loom.integration.cicd;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface DeploymentRepository extends JpaRepository<Deployment, UUID> {
    List<Deployment> findByServiceNameAndEnvironmentAndDeploymentTimeAfter(
            String serviceName, String environment, Instant cutoffTime);
}
