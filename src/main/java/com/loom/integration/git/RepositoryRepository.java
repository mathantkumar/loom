package com.loom.integration.git;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RepositoryRepository extends JpaRepository<Repository, UUID> {
}
