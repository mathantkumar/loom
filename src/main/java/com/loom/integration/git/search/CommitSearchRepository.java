package com.loom.integration.git.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface CommitSearchRepository extends ElasticsearchRepository<CommitDocument, String> {
}
