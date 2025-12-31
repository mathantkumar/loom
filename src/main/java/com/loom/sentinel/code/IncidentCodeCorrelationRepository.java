package com.loom.sentinel.code;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;
import com.loom.incident.domain.Incident;

public interface IncidentCodeCorrelationRepository extends JpaRepository<IncidentCodeCorrelation, UUID> {
    List<IncidentCodeCorrelation> findByIncident(Incident incident);
}
