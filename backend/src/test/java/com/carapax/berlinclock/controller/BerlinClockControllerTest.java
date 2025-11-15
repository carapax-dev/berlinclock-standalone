package com.carapax.berlinclock.controller;

import com.carapax.berlinclock.model.BerlinClockTime;
import com.carapax.berlinclock.service.BerlinClockService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for BerlinClockController.
 * Tests REST API endpoints.
 *
 * @author Jose Benitez
 */
@WebMvcTest(BerlinClockController.class)
class BerlinClockControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BerlinClockService berlinClockService;

    @Test
    @DisplayName("GET /api/time should return current Berlin time")
    void testGetCurrentTime() throws Exception {
        // Given
        BerlinClockTime mockTime = new BerlinClockTime(
                "Y",
                "RROO",
                "RRRO",
                "YYROOOOOOOO",
                "YYOO",
                "13:17:00"
        );
        when(berlinClockService.getCurrentBerlinTime()).thenReturn(mockTime);

        // When & Then
        mockMvc.perform(get("/api/time"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.secondsLamp").value("Y"))
                .andExpect(jsonPath("$.fiveHoursRow").value("RROO"))
                .andExpect(jsonPath("$.singleHoursRow").value("RRRO"))
                .andExpect(jsonPath("$.fiveMinutesRow").value("YYROOOOOOOO"))
                .andExpect(jsonPath("$.singleMinutesRow").value("YYOO"))
                .andExpect(jsonPath("$.currentTime").value("13:17:00"));
    }

    @Test
    @DisplayName("GET /api/time/convert should convert specific time")
    void testConvertTime() throws Exception {
        // Given
        String timeToConvert = "12:30:45";
        BerlinClockTime mockTime = new BerlinClockTime(
                "O",
                "RROO",
                "RROO",
                "YYRYYROOOOO",
                "OOOO",
                "12:30:45"
        );
        when(berlinClockService.convertToBerlinTime(timeToConvert)).thenReturn(mockTime);

        // When & Then
        mockMvc.perform(get("/api/time/convert")
                        .param("time", timeToConvert))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.secondsLamp").value("O"))
                .andExpect(jsonPath("$.fiveHoursRow").value("RROO"))
                .andExpect(jsonPath("$.singleHoursRow").value("RROO"))
                .andExpect(jsonPath("$.fiveMinutesRow").value("YYRYYROOOOO"))
                .andExpect(jsonPath("$.singleMinutesRow").value("OOOO"))
                .andExpect(jsonPath("$.currentTime").value("12:30:45"));
    }

    @Test
    @DisplayName("GET /api/time/convert should return 400 for invalid time")
    void testConvertTimeWithInvalidFormat() throws Exception {
        // Given
        String invalidTime = "invalid";
        when(berlinClockService.convertToBerlinTime(invalidTime))
                .thenThrow(new IllegalArgumentException("Invalid time format"));

        // When & Then
        mockMvc.perform(get("/api/time/convert")
                        .param("time", invalidTime))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/time should have CORS enabled")
    void testCorsEnabled() throws Exception {
        // Given
        BerlinClockTime mockTime = new BerlinClockTime(
                "Y", "OOOO", "OOOO", "OOOOOOOOOOO", "OOOO", "00:00:00"
        );
        when(berlinClockService.getCurrentBerlinTime()).thenReturn(mockTime);

        // When & Then
        mockMvc.perform(get("/api/time")
                        .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }

    // ===== DECODE ENDPOINT TESTS =====

    @Test
    @DisplayName("POST /api/time/decode should decode Berlin Clock format")
    void testDecodeBerlinTime() throws Exception {
        // Given
        String requestBody = """
                {
                    "secondsLamp": "Y",
                    "fiveHoursRow": "RROO",
                    "singleHoursRow": "RRRO",
                    "fiveMinutesRow": "YYROOOOOOOO",
                    "singleMinutesRow": "YYOO",
                    "currentTime": ""
                }
                """;
        when(berlinClockService.decodeBerlinTime(any(BerlinClockTime.class)))
                .thenReturn("13:17:00");

        // When & Then
        mockMvc.perform(post("/api/time/decode")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.time").value("13:17:00"));
    }

    @Test
    @DisplayName("POST /api/time/decode should decode midnight correctly")
    void testDecodeMidnight() throws Exception {
        // Given
        String requestBody = """
                {
                    "secondsLamp": "Y",
                    "fiveHoursRow": "OOOO",
                    "singleHoursRow": "OOOO",
                    "fiveMinutesRow": "OOOOOOOOOOO",
                    "singleMinutesRow": "OOOO",
                    "currentTime": ""
                }
                """;
        when(berlinClockService.decodeBerlinTime(any(BerlinClockTime.class)))
                .thenReturn("00:00:00");

        // When & Then
        mockMvc.perform(post("/api/time/decode")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.time").value("00:00:00"));
    }

    @Test
    @DisplayName("POST /api/time/decode should return 400 for invalid Berlin Clock format")
    void testDecodeInvalidBerlinClock() throws Exception {
        // Given
        String requestBody = """
                {
                    "secondsLamp": "Y",
                    "fiveHoursRow": "INVALID",
                    "singleHoursRow": "OOOO",
                    "fiveMinutesRow": "OOOOOOOOOOO",
                    "singleMinutesRow": "OOOO",
                    "currentTime": ""
                }
                """;
        when(berlinClockService.decodeBerlinTime(any(BerlinClockTime.class)))
                .thenThrow(new IllegalArgumentException("Invalid Berlin Clock format"));

        // When & Then
        mockMvc.perform(post("/api/time/decode")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/time/decode should have CORS enabled")
    void testDecodeWithCors() throws Exception {
        // Given
        String requestBody = """
                {
                    "secondsLamp": "Y",
                    "fiveHoursRow": "OOOO",
                    "singleHoursRow": "OOOO",
                    "fiveMinutesRow": "OOOOOOOOOOO",
                    "singleMinutesRow": "OOOO",
                    "currentTime": ""
                }
                """;
        when(berlinClockService.decodeBerlinTime(any(BerlinClockTime.class)))
                .thenReturn("00:00:00");

        // When & Then
        mockMvc.perform(post("/api/time/decode")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                        .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }
}