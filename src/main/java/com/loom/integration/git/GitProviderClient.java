package com.loom.integration.git;

import java.time.Instant;
import java.util.List;

public interface GitProviderClient {
    List<Commit> fetchCommits(String owner, String repo, Instant since);

    List<PullRequest> fetchPullRequests(String owner, String repo, Instant since);
}
