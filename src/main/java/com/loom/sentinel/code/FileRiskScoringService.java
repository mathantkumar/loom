package com.loom.sentinel.code;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

import com.loom.integration.git.Commit;
import com.loom.integration.git.CommitRepository;
import com.loom.sentinel.code.FileRiskProfile.RiskLevel;

@Service
public class FileRiskScoringService {

    private final IncidentCodeCorrelationRepository correlationRepository;
    private final CommitRepository commitRepository;
    private final FileRiskProfileRepository riskProfileRepository;

    public FileRiskScoringService(IncidentCodeCorrelationRepository correlationRepository,
            CommitRepository commitRepository,
            FileRiskProfileRepository riskProfileRepository) {
        this.correlationRepository = correlationRepository;
        this.commitRepository = commitRepository;
        this.riskProfileRepository = riskProfileRepository;
    }

    // Run every hour
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void updateRiskScores() {
        // Simple approach: Iterate all correlations, find files, increment counts.
        // In prod: Use incremental updates or efficient aggregation queries.

        List<IncidentCodeCorrelation> correlations = correlationRepository.findAll();
        Map<String, Integer> fileIncidentCounts = new HashMap<>(); // Key: "repo/file"

        for (IncidentCodeCorrelation corr : correlations) {
            Optional<Commit> commitOpt = commitRepository.findById(corr.getCommitSha());
            if (commitOpt.isPresent()) {
                Commit commit = commitOpt.get();
                String repoName = commit.getRepository().getName();
                for (String file : commit.getFilesChanged()) {
                    String key = repoName + "::" + file;
                    fileIncidentCounts.put(key, fileIncidentCounts.getOrDefault(key, 0) + 1);
                }
            }
        }

        // Update profiles
        fileIncidentCounts.forEach((key, count) -> {
            String[] parts = key.split("::");
            if (parts.length == 2) {
                String repoName = parts[0];
                String filePath = parts[1];

                FileRiskProfile profile = riskProfileRepository
                        .findByRepositoryNameAndFilePath(repoName, filePath)
                        .orElse(new FileRiskProfile());

                if (profile.getId() == null) {
                    profile.setRepositoryName(repoName);
                    profile.setFilePath(filePath);
                }

                profile.setIncidentCount(count);
                profile.setLastUpdated(Instant.now());
                profile.setRiskLevel(calculateRisk(count));

                riskProfileRepository.save(profile);
            }
        });
    }

    private RiskLevel calculateRisk(int incidentCount) {
        if (incidentCount >= 3)
            return RiskLevel.HIGH;
        if (incidentCount >= 1)
            return RiskLevel.MEDIUM;
        return RiskLevel.LOW;
    }
}
