package com.loom.sentinel.code;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FileRiskProfileRepository extends JpaRepository<FileRiskProfile, Long> {
    Optional<FileRiskProfile> findByRepositoryNameAndFilePath(String repositoryName, String filePath);
    // Top risky files custom query could go here
}
