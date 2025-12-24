package com.loom.sentinel.causality;

import java.util.ArrayList;
import java.util.List;

public class CausalityGraph {
    private List<Node> nodes = new ArrayList<>();
    private List<Edge> edges = new ArrayList<>();

    public void addNode(Node node) {
        this.nodes.add(node);
    }

    public void addEdge(Edge edge) {
        this.edges.add(edge);
    }

    public List<Node> getNodes() {
        return nodes;
    }

    public List<Edge> getEdges() {
        return edges;
    }

    public static class Node {
        public String id;
        public String type; // INCIDENT, SERVICE, DEPLOYMENT, PROJECT
        public String label;
        public String status; // For color coding (critical, success, etc)

        public Node(String id, String type, String label, String status) {
            this.id = id;
            this.type = type;
            this.label = label;
            this.status = status;
        }
    }

    public static class Edge {
        public String source;
        public String target;
        public String relationship; // "CAUSED_BY", "AFFECTS", "BELONGS_TO"
        public double confidence; // 0.0 - 1.0

        public Edge(String source, String target, String relationship, double confidence) {
            this.source = source;
            this.target = target;
            this.relationship = relationship;
            this.confidence = confidence;
        }
    }
}
