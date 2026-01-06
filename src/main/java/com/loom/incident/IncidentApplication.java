package com.loom.incident;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(scanBasePackages = "com.loom")
@EnableAsync
public class IncidentApplication {

    public static void main(String[] args) {
        SpringApplication.run(IncidentApplication.class, args);
    }
}
