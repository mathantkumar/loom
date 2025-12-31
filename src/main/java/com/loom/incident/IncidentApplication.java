package com.loom.incident;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(scanBasePackages = "com.loom")
@EntityScan(basePackages = "com.loom")
@EnableJpaRepositories(basePackages = "com.loom")
@EnableElasticsearchRepositories(basePackages = "com.loom")
@EnableAsync
public class IncidentApplication {

    public static void main(String[] args) {
        SpringApplication.run(IncidentApplication.class, args);
    }
}
