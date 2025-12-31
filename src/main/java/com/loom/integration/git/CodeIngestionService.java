package com.loom.integration.git;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import com.loom.incident.ai.EmbeddingClient;
import com.loom.integration.git.search.CommitSearchRepository;
import com.loom.integration.git.search.CommitDocument;

@Service
public class CodeIngestionService {

    private final GitProviderClient gitClient;
    private final RepositoryRepository repositoryRepository;
    private final CommitRepository commitRepository;
    private final PullRequestRepository pullRequestRepository;
    private final EmbeddingClient embeddingClient;
    private final CommitSearchRepository commitSearchRepository;

    public CodeIngestionService(GitProviderClient gitClient,
            RepositoryRepository repositoryRepository,
            CommitRepository commitRepository,
            PullRequestRepository pullRequestRepository,
            EmbeddingClient embeddingClient,
            CommitSearchRepository commitSearchRepository) {
        this.gitClient = gitClient;
        this.repositoryRepository = repositoryRepository;
        this.commitRepository = commitRepository;
        this.pullRequestRepository = pullRequestRepository;
        this.embeddingClient = embeddingClient;
        this.commitSearchRepository = commitSearchRepository;
    }

    @Transactional
    public void ingestRepository(String owner, String repoName, String serviceName) {
        // 1. Find or Create Repository
        Repository repo = repositoryRepository.findAll().stream()
                .filter(r -> r.getName().equals(owner + "/" + repoName) && "github".equals(r.getProvider()))
                .findFirst()
                .orElseGet(() -> {
                    Repository newRepo = new Repository();
                    newRepo.setName(owner + "/" + repoName);
                    newRepo.setProvider("github");
                    newRepo.setServiceName(serviceName);
                    return repositoryRepository.save(newRepo);
                });

        // 2. Determine time window
        Instant since = Instant.now().minus(24, ChronoUnit.HOURS);

        // 3. Fetch and Save Commits
        List<Commit> commits = gitClient.fetchCommits(owner, repoName, since);
        for (Commit c : commits) {
            c.setRepository(repo);
            commitRepository.save(c);

            // Index to Elasticsearch
            indexCommit(c, owner + "/" + repoName);
        }

        // 4. Fetch and Save PRs
        List<PullRequest> prs = gitClient.fetchPullRequests(owner, repoName, since);
        for (PullRequest pr : prs) {
            pr.setRepository(repo);
            pullRequestRepository.save(pr);
        }
    }

    private void indexCommit(Commit c, String repoName) {
        try {
            CommitDocument doc = new CommitDocument();
            doc.setSha(c.getSha());
            doc.setMessage(c.getMessage());
            doc.setAuthor(c.getAuthor());
            doc.setTimestamp(c.getTimestamp());
            doc.setRepoName(repoName);
            doc.setFilePaths(c.getFilesChanged());

            // Generate embedding combining message and file paths
            String textToEmbed = (c.getMessage() != null ? c.getMessage() : "") + " "
                    + String.join(" ", c.getFilesChanged());
            List<Double> embedding = embeddingClient.getEmbedding(textToEmbed);
            doc.setEmbedding(embedding);

            commitSearchRepository.save(doc);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
