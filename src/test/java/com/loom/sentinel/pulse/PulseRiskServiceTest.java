package com.loom.sentinel.pulse;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PulseRiskServiceTest {

    private final PulseRiskService service = new PulseRiskService();

    @Test
    void testCalculateRisk_PaymentService() {
        RiskProjection result = service.calculateRisk("payment-service");

        assertNotNull(result);
        assertEquals("HIGH", result.getRiskLevel());
        assertEquals(25, result.getEstimatedFailureInMinutes());
        assertEquals(2.8, result.getDeviationScore());
        assertTrue(result.getExplanation().contains("Memory usage"));
    }

    @Test
    void testCalculateRisk_AuthService() {
        RiskProjection result = service.calculateRisk("auth-service");

        assertNotNull(result);
        assertEquals("MEDIUM", result.getRiskLevel());
        assertEquals(120, result.getEstimatedFailureInMinutes());
        assertEquals(1.5, result.getDeviationScore());
        assertTrue(result.getExplanation().contains("Latency spike"));
    }

    @Test
    void testCalculateRisk_UnknownService() {
        RiskProjection result = service.calculateRisk("unknown-service");

        assertNotNull(result);
        assertEquals("LOW", result.getRiskLevel());
        assertEquals(0.4, result.getDeviationScore());
        assertEquals("Operating within normal parameters", result.getExplanation());
    }
}
