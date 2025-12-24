package com.loom.sentinel.pulse;

import java.util.List;

public class TeamHealth {
    private String teamId;
    private String teamName;
    private double averageLoad;
    private int incidentCount;
    private double riskScore;
    private List<Double> loadDistribution; // e.g. [0.2, 0.5, 0.3] for Low, Med, High

    public TeamHealth(String teamId, String teamName, double averageLoad, int incidentCount, double riskScore,
            List<Double> loadDistribution) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.averageLoad = averageLoad;
        this.incidentCount = incidentCount;
        this.riskScore = riskScore;
        this.loadDistribution = loadDistribution;
    }

    public String getTeamId() {
        return teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public double getAverageLoad() {
        return averageLoad;
    }

    public int getIncidentCount() {
        return incidentCount;
    }

    public double getRiskScore() {
        return riskScore;
    }

    public List<Double> getLoadDistribution() {
        return loadDistribution;
    }
}
