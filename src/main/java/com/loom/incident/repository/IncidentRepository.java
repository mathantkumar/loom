package com.loom.incident.repository;

import com.loom.incident.domain.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID> {
    java.util.Optional<Incident> findByPublicId(String publicId);

    // We'll use a native query to get the next sequence value safely from Postgres
    @org.springframework.data.jpa.repository.Query(value = "SELECT nextval('incident_id_seq')", nativeQuery = true)
    Long getNextSequenceValue();

    java.util.List<Incident> findByServiceAndCreatedAtAfter(String service, java.time.Instant createdAt);

    java.util.List<Incident> findByAssigneeName(String assigneeName);

    java.util.List<Incident> findTop5ByServiceOrderByCreatedAtDesc(String service);
}
