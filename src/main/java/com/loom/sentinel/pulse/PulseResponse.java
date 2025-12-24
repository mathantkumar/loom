package com.loom.sentinel.pulse;

import java.util.List;

public class PulseResponse {
    private List<Engineer> engineers;
    private List<TeamHealth> teams;
    private List<SystemicSignal> systemicSignals;
    private double orgLoadIndex; // 0.0 - 1.0

    public PulseResponse(List<Engineer> engineers, List<TeamHealth> teams, List<SystemicSignal> systemicSignals,
            double orgLoadIndex) {
        this.engineers = engineers;
        this.teams = teams;
        this.systemicSignals = systemicSignals;
        this.orgLoadIndex = orgLoadIndex;
    }

    public List<Engineer> getEngineers() {
        return engineers;
    }

    public List<TeamHealth> getTeams() {
        return teams;
    }

    public List<SystemicSignal> getSystemicSignals() {
        return systemicSignals;
    }

    public double getOrgLoadIndex() {
        return orgLoadIndex;
    }
}
