package com.loom.incident.api;

import com.loom.incident.service.EscalationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EscalationController.class)
public class EscalationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EscalationService escalationService;

    @Test
    public void testEscalationEndpoint() throws Exception {
        String incidentId = "test-uuid";
        EscalationService.EscalationResponse mockResponse = new EscalationService.EscalationResponse();
        mockResponse.assigneeName = "Sarah K";
        mockResponse.eta = "~2 min";
        mockResponse.status = "INVESTIGATING";
        mockResponse.deepAnalysisId = "analysis-123";

        when(escalationService.escalateToOnCall(incidentId)).thenReturn(mockResponse);

        mockMvc.perform(post("/api/incidents/{id}/escalate", incidentId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assigneeName").value("Sarah K"))
                .andExpect(jsonPath("$.status").value("INVESTIGATING"))
                .andExpect(jsonPath("$.deepAnalysisId").value("analysis-123"));
    }
}
