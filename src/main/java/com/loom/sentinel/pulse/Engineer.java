package com.loom.sentinel.pulse;

import java.util.List;
import java.util.UUID;

public class Engineer {
    private String id;
    private String name;
    private String role;
    private String avatarUrl;

    // Pulse Metrics (0.0 - 1.0)
    private double currentLoadScore;
    private double burnoutRisk;
    private int activeIncidents;
    private int assignedProjects;
    private List<Double> trendHistory; // Load score history (last 14 days)
    private double dailyInterruptions; // Estimated interruptions/day
    private String teamId;

    // Computed Insight
    private String statusNarrative;

    public Engineer(String name, String role, String avatarUrl) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.role = role;
        this.avatarUrl = avatarUrl;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public double getCurrentLoadScore() {
        return currentLoadScore;
    }

    public void setCurrentLoadScore(double currentLoadScore) {
        this.currentLoadScore = currentLoadScore;
    }

    public double getBurnoutRisk() {
        return burnoutRisk;
    }

    public void setBurnoutRisk(double burnoutRisk) {
        this.burnoutRisk = burnoutRisk;
    }

    public int getActiveIncidents() {
        return activeIncidents;
    }

    public void setActiveIncidents(int activeIncidents) {
        this.activeIncidents = activeIncidents;
    }

    public int getAssignedProjects() {
        return assignedProjects;
    }

    public void setAssignedProjects(int assignedProjects) {
        this.assignedProjects = assignedProjects;
    }

    public String getStatusNarrative() {
        return statusNarrative;
    }

    public void setStatusNarrative(String statusNarrative) {
        this.statusNarrative = statusNarrative;
    }

    public List<Double> getTrendHistory() {
        return trendHistory;
    }

    public void setTrendHistory(List<Double> trendHistory) {
        this.trendHistory = trendHistory;
    }

    public double getDailyInterruptions() {
        return dailyInterruptions;
    }

    public void setDailyInterruptions(double dailyInterruptions) {
        this.dailyInterruptions = dailyInterruptions;
    }

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }
}
