package com.loom.sentinel.log.repository;

import com.loom.sentinel.log.model.LogEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface LogRepository extends ElasticsearchRepository<LogEntry, String> {

    List<LogEntry> findByServiceAndTimestampBetween(String service, Instant start, Instant end);

    Page<LogEntry> findByTimestampBetween(Instant start, Instant end, Pageable pageable);

    List<LogEntry> findByTraceId(String traceId);
}
