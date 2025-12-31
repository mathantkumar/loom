package com.loom.incident.api;

import com.loom.incident.domain.Evidence;
import com.loom.incident.domain.Incident;
import com.loom.incident.service.IncidentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/incidents")
public class EvidenceController {

    private final IncidentService incidentService;

    public EvidenceController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping(value = "/{id}/evidence", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Evidence> uploadEvidence(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        // Mock storage logic for MVP
        Incident incident = incidentService.getIncidentById(id);

        Evidence evidence = new Evidence();
        evidence.setFilename(file.getOriginalFilename());
        evidence.setFileType(file.getContentType());
        evidence.setSize(file.getSize());
        evidence.setIncident(incident);
        // In a real app, we'd upload to S3/GCS here. For MVP, we'll just mock a URL.
        evidence.setUrl("http://localhost:8080/files/" + file.getOriginalFilename());

        // Save via incident update or separate repository.
        // Since we have CascadeType.ALL, adding to incident and saving incident works,
        // or saving evidence directly if we had a repository.
        // Let's assume we need to add it to the incident and save the incident,
        // or we need to expose a method in IncidentService to add evidence.

        // Ideally IncidentService handles this transaction script behavior.
        // For simplicity reusing incidentService to save.

        incident.getEvidence().add(evidence);
        incidentService.updateIncident(incident);

        // Retrieve the last added evidence (which has ID now)
        // This is a bit hacky, simpler would be to have EvidenceRepository.
        // Let's rely on the return of updateIncident or just return the constructed
        // object with a predictable ID if mocked?
        // Actually, JPA will assign ID on flush.

        return ResponseEntity.ok(evidence);
    }
}
