package com.loom.incident.repository;

import com.loom.incident.domain.BaselineProfile;
import com.loom.incident.domain.Severity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BaselineProfileRepository extends JpaRepository<BaselineProfile, UUID> {

    Optional<BaselineProfile> findByServiceNameAndSeverity(String serviceName, Severity severity);
}
