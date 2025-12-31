package com.loom.incident.api;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.UUID;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.loom.incident.domain.Incident;
import com.loom.incident.repository.IncidentRepository;
import com.loom.sentinel.code.IncidentCodeCorrelation;
import com.loom.sentinel.code.IncidentCodeCorrelationRepository;
import com.loom.sentinel.code.CodeIncidentCorrelationService;
import com.loom.integration.git.Commit;
import com.loom.integration.git.CommitRepository;

@RestController
@RequestMapping("/api/incidents")
public class IncidentCodeIntelligenceController {

    private final com.loom.incident.service.IncidentService incidentService;
    private final IncidentCodeCorrelationRepository correlationRepository;
    private final CodeIncidentCorrelationService correlationService;
    private final CommitRepository commitRepository;

    public IncidentCodeIntelligenceController(com.loom.incident.service.IncidentService incidentService,
            IncidentCodeCorrelationRepository correlationRepository,
            CodeIncidentCorrelationService correlationService,
            CommitRepository commitRepository) {
        this.incidentService = incidentService;
        this.correlationRepository = correlationRepository;
        this.correlationService = correlationService;
        this.commitRepository = commitRepository;
    }

    @GetMapping("/{id}/code-intelligence")
    public ResponseEntity<List<CodeIntelligenceDTO>> getCodeIntelligence(@PathVariable String id) {
        Incident incident = incidentService.getIncidentById(id);
        List<IncidentCodeCorrelation> correlations = correlationRepository.findByIncident(incident);

        // If no correlations found, try to run correlation on demand (optional, for
        // demo)
        if (correlations.isEmpty()) {
            correlationService.correlateIncident(incident);
            correlations = correlationRepository.findByIncident(incident);
        }

        List<CodeIntelligenceDTO> dtos = correlations.stream().map(c -> {
            CodeIntelligenceDTO dto = new CodeIntelligenceDTO();
            dto.commitSha = c.getCommitSha();
            dto.confidenceScore = c.getConfidenceScore();
            dto.reason = c.getReason();

            // Enrich with Commit info
            Optional<Commit> commitOpt = commitRepository.findById(c.getCommitSha());
            commitOpt.ifPresent(commit -> {
                dto.message = commit.getMessage();
                dto.author = commit.getAuthor();
                dto.timestamp = commit.getTimestamp().toString();
                dto.avatarUrl = "https://github.com/" + commit.getAuthor() + ".png"; // Simple approximation
            });
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    public static class CodeIntelligenceDTO {
        public String commitSha;
        public Double confidenceScore;
        public String reason;
        public String message;
        public String author;
        public String timestamp;
        public String avatarUrl;
    }
}
