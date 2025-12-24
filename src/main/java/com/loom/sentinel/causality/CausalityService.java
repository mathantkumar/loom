package com.loom.sentinel.causality;

import com.loom.incident.domain.Incident;
import com.loom.incident.repository.IncidentRepository;
import com.loom.integration.cicd.Deployment;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CausalityService {

        private final IncidentRepository incidentRepository;

        public CausalityService(IncidentRepository incidentRepository) {
                this.incidentRepository = incidentRepository;
        }

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
                                        .orElseThrow(() -> new RuntimeException(
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

                // 4. Project Node (Inferred from Service for MVP)
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
}
