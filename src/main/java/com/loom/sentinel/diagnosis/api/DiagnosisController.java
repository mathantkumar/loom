package com.loom.sentinel.diagnosis.api;

import com.loom.sentinel.diagnosis.service.SentinelDiagnosisService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/diagnosis")
@CrossOrigin(originPatterns = "*") // Allow frontend access
public class DiagnosisController {

    private final SentinelDiagnosisService diagnosisService;

    public DiagnosisController(SentinelDiagnosisService diagnosisService) {
        this.diagnosisService = diagnosisService;
    }

    @GetMapping("/{incidentId}/stream")
    public SseEmitter streamDiagnosis(@PathVariable String incidentId) {
        return diagnosisService.runDiagnosis(incidentId);
    }
}
