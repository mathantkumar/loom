package com.loom.integration.cicd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/integrations/github")
public class CiCdController {

    private final DeploymentService deploymentService;

    @Autowired
    public CiCdController(DeploymentService deploymentService) {
        this.deploymentService = deploymentService;
    }

    @PostMapping("/deployments")
    public ResponseEntity<Deployment> receiveDeploymentWebhook(@RequestBody Deployment deployment) {
        Deployment saved = deploymentService.saveDeployment(deployment);
        return ResponseEntity.ok(saved);
    }
}
