package com.loom.sentinel.ask.api;

import com.loom.incident.domain.Incident;
import java.util.List;

public class AskResponse {
    private String answer;
    private List<Incident> incidents;
    private boolean found;

    public AskResponse(String answer, List<Incident> incidents, boolean found) {
        this.answer = answer;
        this.incidents = incidents;
        this.found = found;
    }

    public static AskResponse success(String answer, List<Incident> incidents) {
        return new AskResponse(answer, incidents, true);
    }

    public static AskResponse noData() {
        return new AskResponse("No historical incident evidence found.", List.of(), false);
    }

    public String getAnswer() {
        return answer;
    }

    public List<Incident> getIncidents() {
        return incidents;
    }

    public boolean isFound() {
        return found;
    }
}
