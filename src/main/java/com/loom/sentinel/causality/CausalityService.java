package com.loom.sentinel.causality;

import com.loom.incident.domain.Incident;
import com.loom.incident.repository.IncidentRepository;
import com.loom.integration.cicd.Deployment;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CausalityService {

        private final IncidentRepository incidentRepository;
        private final com.loom.incident.service.AIAnalysisService aiAnalysisService;
        private final com.loom.incident.service.IncidentSearchService incidentSearchService;

        public CausalityService(IncidentRepository incidentRepository,
                        com.loom.incident.service.AIAnalysisService aiAnalysisService,
                        com.loom.incident.service.IncidentSearchService incidentSearchService) {
                this.incidentRepository = incidentRepository;
                this.aiAnalysisService = aiAnalysisService;
                this.incidentSearchService = incidentSearchService;
        }

        @Transactional(readOnly = true)
        public CausalityGraph buildGraph(String incidentIdStr) {
                Incident incident = null;

                // Try UUID
                try {
                        UUID id = UUID.fromString(incidentIdStr);
                        incident = incidentRepository.findById(id).orElse(null);
                } catch (IllegalArgumentException e) {
                        // Not a UUID, ignore
                }

                // Try Public ID if not found
                if (incident == null) {
                        incident = incidentRepository.findByPublicId(incidentIdStr)
                                        .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                                        org.springframework.http.HttpStatus.NOT_FOUND,
                                                        "Incident not found: " + incidentIdStr));
                }

                CausalityGraph graph = new CausalityGraph();

                // 1. Add Incident Node (Center)
                CausalityGraph.Node incidentNode = new CausalityGraph.Node(
                                incident.getId().toString(),
                                "INCIDENT",
                                incident.getTitle(),
                                "CRITICAL");
                graph.addNode(incidentNode);

                // 2. Add Service Node
                if (incident.getService() != null) {
                        CausalityGraph.Node serviceNode = new CausalityGraph.Node(
                                        "svc-" + incident.getService(),
                                        "SERVICE",
                                        incident.getService(),
                                        "WARNING");
                        graph.addNode(serviceNode);
                        graph.addEdge(new CausalityGraph.Edge(
                                        incidentNode.id, serviceNode.id, "AFFECTS", 1.0));
                }

                // 3. Add Correlated Deployments
                if (incident.getCorrelatedDeployments() != null) {
                        for (Deployment dep : incident.getCorrelatedDeployments()) {
                                CausalityGraph.Node depNode = new CausalityGraph.Node(
                                                "dep-" + dep.getId(),
                                                "DEPLOYMENT",
                                                "Deploy " + dep.getCommitHash().substring(0, 7),
                                                "SUCCESS");
                                graph.addNode(depNode);
                                graph.addEdge(new CausalityGraph.Edge(
                                                depNode.id, incidentNode.id, "POTENTIAL_CAUSE", 0.85));
                        }
                }

                // 4. AI Hypothesis Node (Dynamic)
                try {
                        com.loom.incident.api.dto.AnalysisResponse analysis = aiAnalysisService
                                        .analyzeIncident(incident.getId());
                        if (analysis.getHypotheses() != null && !analysis.getHypotheses().isEmpty()) {
                                var topHypothesis = analysis.getHypotheses().get(0);
                                String hypId = "hyp-" + UUID.randomUUID().toString().substring(0, 8);
                                CausalityGraph.Node hypNode = new CausalityGraph.Node(
                                                hypId,
                                                "HYPOTHESIS",
                                                "Cause: " + (topHypothesis.getRootCause().length() > 20
                                                                ? topHypothesis.getRootCause().substring(0, 20) + "..."
                                                                : topHypothesis.getRootCause()),
                                                "DANGER");
                                graph.addNode(hypNode);
                                graph.addEdge(new CausalityGraph.Edge(
                                                incidentNode.id, hypId, "PROBABLE_CAUSE",
                                                topHypothesis.getConfidence()));
                        }
                } catch (Exception e) {
                        // AI analysis might fail, but graph should load
                }

                // 5. Similar Incidents (Dynamic Context)
                try {
                        var similar = incidentSearchService.findSimilarIncidents(incident.getId());
                        for (var sim : similar) {
                                if (sim.getSimilarityScore() > 0.6) { // Filter distinct enough
                                        CausalityGraph.Node simNode = new CausalityGraph.Node(
                                                        sim.getIncidentId().toString(),
                                                        "SIMILAR_INCIDENT",
                                                        "Similar: " + sim.getTitle(),
                                                        "NORMAL");
                                        graph.addNode(simNode);
                                        graph.addEdge(new CausalityGraph.Edge(
                                                        incidentNode.id, sim.getIncidentId().toString(), "RESEMBLES",
                                                        sim.getSimilarityScore()));
                                }
                        }
                } catch (Exception e) {
                        // ignore
                }

                // 6. Project Node (Inferred from Service for MVP)
                if (incident.getService() != null) {
                        CausalityGraph.Node projectNode = new CausalityGraph.Node(
                                        "proj-" + incident.getService(),
                                        "PROJECT",
                                        "Project " + incident.getService(),
                                        "NORMAL");
                        graph.addNode(projectNode);
                        graph.addEdge(new CausalityGraph.Edge(
                                        "svc-" + incident.getService(), projectNode.id, "BELONGS_TO", 1.0));
                }

                return graph;
        }

        @Transactional(readOnly = true)
        public CausalityGraph buildServiceGraph(String serviceId) {
                CausalityGraph graph = new CausalityGraph();

                // 1. Center Node: The Service
                CausalityGraph.Node serviceNode = new CausalityGraph.Node(
                                "svc-" + serviceId,
                                "SERVICE",
                                serviceId,
                                "NORMAL"); // Default, will upgrade if incidents found
                graph.addNode(serviceNode);

                // 2. Recent Deployments (Left Side)
                // We need to inject DeploymentRepository for this.
                // Assuming it will be injected in the constructor update below.
                /*
                 * For now, simulating deployment fetch if repo not injected yet.
                 * TODO: Add DeploymentRepository to constructor.
                 */
                // Placeholder until repo injection:
                // graph.addNode(new CausalityGraph.Node("dep-mock", "DEPLOYMENT", "Recent
                // Deploy", "SUCCESS"));

                // 3. Active Incidents (Right Side)
                // Fetch recent incidents for service to see if any are active
                try {
                        // We can reuse findTop5... and filter for non-resolved
                        var recent = incidentRepository.findTop5ByServiceOrderByCreatedAtDesc(serviceId);
                        boolean hasActive = false;

                        for (Incident inc : recent) {
                                if (inc.getStatus() != com.loom.incident.domain.IncidentStatus.RESOLVED &&
                                                inc.getStatus() != com.loom.incident.domain.IncidentStatus.CLOSED) {

                                        hasActive = true;
                                        // Add Incident Node
                                        CausalityGraph.Node incNode = new CausalityGraph.Node(
                                                        inc.getId().toString(),
                                                        "INCIDENT",
                                                        inc.getTitle().length() > 20
                                                                        ? inc.getTitle().substring(0, 20) + "..."
                                                                        : inc.getTitle(),
                                                        "DANGER");
                                        graph.addNode(incNode);
                                        graph.addEdge(new CausalityGraph.Edge(incNode.id, serviceNode.id, "IMPACTS",
                                                        1.0));
                                }
                        }

                        if (hasActive) {
                                // Upgrade service status
                                graph.getNodes().remove(serviceNode); // Remove old
                                serviceNode = new CausalityGraph.Node(
                                                "svc-" + serviceId,
                                                "SERVICE",
                                                serviceId,
                                                "WARNING");
                                graph.addNode(serviceNode);
                        }

                        // Add dependencies (Mock for MVP)
                        if (serviceId.contains("payment")) {
                                CausalityGraph.Node dbNode = new CausalityGraph.Node("db-payment", "INFRASTRUCTURE",
                                                "Payment DB", "NORMAL");
                                graph.addNode(dbNode);
                                graph.addEdge(new CausalityGraph.Edge(serviceNode.id, dbNode.id, "DEPENDS_ON", 1.0));

                                CausalityGraph.Node extNode = new CausalityGraph.Node("ext-stripe", "EXTERNAL",
                                                "Stripe API", "NORMAL");
                                graph.addNode(extNode);
                                graph.addEdge(new CausalityGraph.Edge(serviceNode.id, extNode.id, "CALLS", 1.0));
                        } else if (serviceId.contains("auth")) {
                                CausalityGraph.Node dbNode = new CausalityGraph.Node("db-users", "INFRASTRUCTURE",
                                                "User DB", "NORMAL");
                                graph.addNode(dbNode);
                                graph.addEdge(new CausalityGraph.Edge(serviceNode.id, dbNode.id, "DEPENDS_ON", 1.0));
                        }

                } catch (Exception e) {
                        // ignore
                }

                return graph;
        }
}
