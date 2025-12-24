package com.loom.sentinel.pulse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sentinel/pulse")
@CrossOrigin(origins = "${loom.cors.allowed-origins:http://localhost:5173}")
public class PulseController {

    private final PulseService pulseService;

    public PulseController(PulseService pulseService) {
        this.pulseService = pulseService;
    }

    @GetMapping("/data")
    public ResponseEntity<PulseResponse> getPulseData() {
        return ResponseEntity.ok(pulseService.getPulseData());
    }
}
