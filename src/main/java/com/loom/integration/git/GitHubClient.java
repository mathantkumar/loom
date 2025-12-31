package com.loom.integration.git;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
public class GitHubClient implements GitProviderClient {

    @Value("${loom.github.token:@null}")
    private String githubToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String GITHUB_API_URL = "https://api.github.com";

    @Override
    public List<Commit> fetchCommits(String owner, String repo, Instant since) {
        String url = String.format("%s/repos/%s/%s/commits?since=%s", GITHUB_API_URL, owner, repo, since.toString());

        try {
            ResponseEntity<GitHubCommitListDTO[]> response = restTemplate.exchange(url, HttpMethod.GET, createEntity(),
                    GitHubCommitListDTO[].class);
            if (response.getBody() != null) {
                return Arrays.stream(response.getBody())
                        .map(dto -> fetchCommitDetails(owner, repo, dto.sha)) // Fetch details to get files
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Collections.emptyList();
    }

    private Commit fetchCommitDetails(String owner, String repo, String sha) {
        String url = String.format("%s/repos/%s/%s/commits/%s", GITHUB_API_URL, owner, repo, sha);
        try {
            ResponseEntity<GitHubCommitDetailDTO> response = restTemplate.exchange(url, HttpMethod.GET, createEntity(),
                    GitHubCommitDetailDTO.class);
            if (response.getBody() != null) {
                return mapToCommit(response.getBody());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // Fallback if detail fetch fails
        Commit fallback = new Commit();
        fallback.setSha(sha);
        return fallback;
    }

    @Override
    public List<PullRequest> fetchPullRequests(String owner, String repo, Instant since) {
        String url = String.format("%s/repos/%s/%s/pulls?state=all&sort=updated&direction=desc", GITHUB_API_URL, owner,
                repo);

        try {
            ResponseEntity<GitHubPRDTO[]> response = restTemplate.exchange(url, HttpMethod.GET, createEntity(),
                    GitHubPRDTO[].class);
            if (response.getBody() != null) {
                List<PullRequest> prs = new ArrayList<>();
                for (GitHubPRDTO dto : response.getBody()) {
                    if (dto.updated_at != null && Instant.parse(dto.updated_at).isAfter(since)) {
                        prs.add(mapToPullRequest(dto));
                    }
                }
                return prs;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Collections.emptyList();
    }

    private HttpEntity<String> createEntity() {
        HttpHeaders headers = new HttpHeaders();
        if (githubToken != null && !githubToken.isEmpty() && !"@null".equals(githubToken)) {
            headers.set("Authorization", "Bearer " + githubToken);
        }
        headers.set("Accept", "application/vnd.github.v3+json");
        return new HttpEntity<>(headers);
    }

    private Commit mapToCommit(GitHubCommitDetailDTO dto) {
        Commit commit = new Commit();
        commit.setSha(dto.sha);
        if (dto.commit != null) {
            commit.setMessage(dto.commit.message);
            if (dto.commit.author != null) {
                commit.setAuthor(dto.commit.author.name);
                commit.setTimestamp(Instant.parse(dto.commit.author.date));
            }
        }
        if (dto.files != null) {
            List<String> files = dto.files.stream()
                    .map(f -> f.filename)
                    .collect(Collectors.toList());
            commit.setFilesChanged(files);
        }
        return commit;
    }

    private PullRequest mapToPullRequest(GitHubPRDTO dto) {
        PullRequest pr = new PullRequest();
        pr.setProviderId(String.valueOf(dto.number));
        pr.setTitle(dto.title);
        if (dto.user != null) {
            pr.setAuthor(dto.user.login);
        }
        if (dto.merged_at != null) {
            pr.setMergedAt(Instant.parse(dto.merged_at));
        }
        return pr;
    }

    // --- DTOs ---

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class GitHubCommitListDTO {
        public String sha;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class GitHubCommitDetailDTO {
        public String sha;
        public CommitInfo commit;
        public List<FileDTO> files;

        static class CommitInfo {
            public String message;
            public Author author;
        }

        static class Author {
            public String name;
            public String date;
        }

        static class FileDTO {
            public String filename;
            public String status;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class GitHubPRDTO {
        public int number;
        public String title;
        public User user;
        public String merged_at;
        public String updated_at;
        public String created_at;

        static class User {
            public String login;
        }
    }
}
