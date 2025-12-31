package com.loom.integration.git;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PullRequestRepository extends JpaRepository<PullRequest, Long> {
}
