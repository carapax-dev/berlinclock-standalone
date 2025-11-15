package com.carapax.berlinclock.service;

import com.carapax.berlinclock.model.BerlinClockTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for BerlinClockService.
 * Tests all time conversion logic with various edge cases.
 *
 * @author Jose Benitez
 */
class BerlinClockServiceTest {

    private BerlinClockService berlinClockService;

    @BeforeEach
    void setUp() {
        berlinClockService = new BerlinClockService();
    }

    @Test
    @DisplayName("Should convert midnight (00:00:00) correctly")
    void testMidnight() {
        BerlinClockTime result = berlinClockService.convertToBerlinTime("00:00:00");

        assertEquals("O", result.getSecondsLamp(), "Seconds lamp should be O (even)");
        assertEquals("OOOO", result.getFiveHoursRow(), "Five hours row should be all off");
        assertEquals("OOOO", result.getSingleHoursRow(), "Single hours row should be all off");
        assertEquals("OOOOOOOOOOO", result.getFiveMinutesRow(), "Five minutes row should be all off");
        assertEquals("OOOO", result.getSingleMinutesRow(), "Single minutes row should be all off");
        assertEquals("00:00:00", result.getCurrentTime());
    }

    @Test
    @DisplayName("Should convert 13:17:01 correctly")
    void testAfternoonTime() {
        BerlinClockTime result = berlinClockService.convertToBerlinTime("13:17:01");

        assertEquals("Y", result.getSecondsLamp(), "Seconds lamp should be Y (odd)");
        assertEquals("RROO", result.getFiveHoursRow(), "13 hours = 2 lamps on (10 hours)");
        assertEquals("RRRO", result.getSingleHoursRow(), "13 hours = 3 remaining hours");
        assertEquals("YYROOOOOOOO", result.getFiveMinutesRow(), "17 minutes = 3 lamps on (15 minutes)");
        assertEquals("YYOO", result.getSingleMinutesRow(), "17 minutes = 2 remaining minutes");
        assertEquals("13:17:01", result.getCurrentTime());
    }

    @Test
    @DisplayName("Should convert 23:59:59 correctly")
    void testEndOfDay() {
        BerlinClockTime result = berlinClockService.convertToBerlinTime("23:59:59");

        assertEquals("Y", result.getSecondsLamp(), "Seconds lamp should be Y (odd)");
        assertEquals("RRRR", result.getFiveHoursRow(), "23 hours = 4 lamps on (20 hours)");
        assertEquals("RRRO", result.getSingleHoursRow(), "23 hours = 3 remaining hours");
        assertEquals("YYRYYRYYRYY", result.getFiveMinutesRow(), "59 minutes = 11 lamps on (55 minutes)");
        assertEquals("YYYY", result.getSingleMinutesRow(), "59 minutes = 4 remaining minutes");
        assertEquals("23:59:59", result.getCurrentTime());
    }

    @ParameterizedTest
    @DisplayName("Should handle seconds lamp correctly for even/odd seconds")
    @CsvSource({
            "00:00:00, O",
            "00:00:01, Y",
            "00:00:02, O",
            "00:00:59, Y"
    })
    void testSecondsLamp(String time, String expectedLamp) {
        BerlinClockTime result = berlinClockService.convertToBerlinTime(time);
        assertEquals(expectedLamp, result.getSecondsLamp());
    }

    @ParameterizedTest
    @DisplayName("Should convert hours correctly")
    @CsvSource({
            "00:00:00, OOOO, OOOO",
            "01:00:00, OOOO, ROOO",
            "05:00:00, ROOO, OOOO",
            "10:00:00, RROO, OOOO",
            "13:00:00, RROO, RRRO",
            "15:00:00, RRRO, OOOO",
            "20:00:00, RRRR, OOOO",
            "23:00:00, RRRR, RRRO"
    })
    void testHoursConversion(String time, String expectedFiveHours, String expectedSingleHours) {
        BerlinClockTime result = berlinClockService.convertToBerlinTime(time);
        assertEquals(expectedFiveHours, result.getFiveHoursRow());
        assertEquals(expectedSingleHours, result.getSingleHoursRow());
    }

    @ParameterizedTest
    @DisplayName("Should convert minutes correctly")
    @CsvSource({
            "00:00:00, OOOOOOOOOOO, OOOO",
            "00:01:00, OOOOOOOOOOO, YOOO",
            "00:05:00, YOOOOOOOOOO, OOOO",
            "00:15:00, YYROOOOOOOO, OOOO",
            "00:30:00, YYRYYROOOOO, OOOO",
            "00:45:00, YYRYYRYYROO, OOOO",
            "00:59:00, YYRYYRYYRYY, YYYY"
    })
    void testMinutesConversion(String time, String expectedFiveMinutes, String expectedSingleMinutes) {
        BerlinClockTime result = berlinClockService.convertToBerlinTime(time);
        assertEquals(expectedFiveMinutes, result.getFiveMinutesRow());
        assertEquals(expectedSingleMinutes, result.getSingleMinutesRow());
    }

    @Test
    @DisplayName("Should verify quarter hour markers (every 3rd lamp is red)")
    void testQuarterHourRedMarkers() {
        BerlinClockTime result = berlinClockService.convertToBerlinTime("00:59:00");
        String fiveMinutesRow = result.getFiveMinutesRow();

        assertEquals('R', fiveMinutesRow.charAt(2), "Position 3 should be red (15 min marker)");
        assertEquals('R', fiveMinutesRow.charAt(5), "Position 6 should be red (30 min marker)");
        assertEquals('R', fiveMinutesRow.charAt(8), "Position 9 should be red (45 min marker)");
    }

    @Test
    @DisplayName("Should throw exception for invalid time format")
    void testInvalidTimeFormat() {
        assertThrows(IllegalArgumentException.class, () -> {
            berlinClockService.convertToBerlinTime("25:00:00");
        }, "Should throw exception for invalid hour");

        assertThrows(IllegalArgumentException.class, () -> {
            berlinClockService.convertToBerlinTime("12:60:00");
        }, "Should throw exception for invalid minute");

        assertThrows(IllegalArgumentException.class, () -> {
            berlinClockService.convertToBerlinTime("invalid");
        }, "Should throw exception for invalid format");
    }

    @Test
    @DisplayName("Should convert LocalTime object correctly")
    void testConvertWithLocalTime() {
        LocalTime time = LocalTime.of(12, 30, 45);
        BerlinClockTime result = berlinClockService.convertToBerlinTime(time);

        assertEquals("Y", result.getSecondsLamp()); // 45 is odd
        assertEquals("RROO", result.getFiveHoursRow());
        assertEquals("RROO", result.getSingleHoursRow());
        assertEquals("YYRYYROOOOO", result.getFiveMinutesRow());
        assertEquals("OOOO", result.getSingleMinutesRow());
        assertEquals("12:30:45", result.getCurrentTime());
    }

    @Test
    @DisplayName("Should get current Berlin time without errors")
    void testGetCurrentBerlinTime() {
        BerlinClockTime result = berlinClockService.getCurrentBerlinTime();

        assertNotNull(result, "Result should not be null");
        assertNotNull(result.getSecondsLamp(), "Seconds lamp should not be null");
        assertNotNull(result.getFiveHoursRow(), "Five hours row should not be null");
        assertNotNull(result.getSingleHoursRow(), "Single hours row should not be null");
        assertNotNull(result.getFiveMinutesRow(), "Five minutes row should not be null");
        assertNotNull(result.getSingleMinutesRow(), "Single minutes row should not be null");
        assertNotNull(result.getCurrentTime(), "Current time should not be null");
    }

    @Test
    @DisplayName("Should have correct lamp counts in all rows")
    void testLampCounts() {
        BerlinClockTime result = berlinClockService.convertToBerlinTime("12:34:56");

        assertEquals(1, result.getSecondsLamp().length(), "Seconds should have 1 lamp");
        assertEquals(4, result.getFiveHoursRow().length(), "Five hours row should have 4 lamps");
        assertEquals(4, result.getSingleHoursRow().length(), "Single hours row should have 4 lamps");
        assertEquals(11, result.getFiveMinutesRow().length(), "Five minutes row should have 11 lamps");
        assertEquals(4, result.getSingleMinutesRow().length(), "Single minutes row should have 4 lamps");
    }

    // ===== DECODE TESTS =====

    @Test
    @DisplayName("Should decode midnight (00:00:00) correctly")
    void testDecodeMidnight() {
        BerlinClockTime berlinTime = new BerlinClockTime(
                "O", "OOOO", "OOOO", "OOOOOOOOOOO", "OOOO", ""
        );
        String result = berlinClockService.decodeBerlinTime(berlinTime);
        assertEquals("00:00:00", result);
    }

    @Test
    @DisplayName("Should decode 13:17:01 correctly")
    void testDecodeAfternoonTime() {
        BerlinClockTime berlinTime = new BerlinClockTime(
                "Y", "RROO", "RRRO", "YYROOOOOOOO", "YYOO", ""
        );
        String result = berlinClockService.decodeBerlinTime(berlinTime);
        assertEquals("13:17:01", result);
    }

    @Test
    @DisplayName("Should decode 23:59:01 correctly - odd seconds")
    void testDecodeEndOfDay() {
        BerlinClockTime berlinTime = new BerlinClockTime(
                "Y", "RRRR", "RRRO", "YYRYYRYYRYY", "YYYY", ""
        );
        String result = berlinClockService.decodeBerlinTime(berlinTime);
        assertEquals("23:59:01", result); // Note: seconds lamp 'Y' = odd = 1
    }

    @ParameterizedTest
    @DisplayName("Should decode various times correctly")
    @CsvSource({
            "O, OOOO, OOOO, OOOOOOOOOOO, OOOO, 00:00:00",
            "O, OOOO, ROOO, OOOOOOOOOOO, YOOO, 01:01:00",
            "O, ROOO, OOOO, YOOOOOOOOOO, OOOO, 05:05:00",
            "O, RROO, OOOO, YOOOOOOOOOO, OOOO, 10:05:00",
            "O, RROO, RRRO, YYROOOOOOOO, OOOO, 13:15:00",
            "O, RRRO, OOOO, YYROOOOOOOO, OOOO, 15:15:00",
            "O, RRRR, OOOO, YYRYYROOOOO, OOOO, 20:30:00",
            "O, RRRR, RRRO, YYRYYRYYROO, OOOO, 23:45:00"
    })
    void testDecodeVariousTimes(String secondsLamp, String fiveHours, String singleHours,
                                String fiveMinutes, String singleMinutes, String expectedTime) {
        BerlinClockTime berlinTime = new BerlinClockTime(
                secondsLamp, fiveHours, singleHours, fiveMinutes, singleMinutes, ""
        );
        String result = berlinClockService.decodeBerlinTime(berlinTime);
        assertEquals(expectedTime, result);
    }

    @Test
    @DisplayName("Should decode using individual strings")
    void testDecodeWithIndividualStrings() {
        String result = berlinClockService.decodeBerlinTime(
                "O", "RROO", "RROO", "YYRYYROOOOO", "OOOO"
        );
        assertEquals("12:30:00", result);
    }

    @Test
    @DisplayName("Should handle round-trip conversion correctly")
    void testRoundTripConversion() {
        // Convert to Berlin Clock and back
        String originalTime = "14:23:00";
        BerlinClockTime berlinTime = berlinClockService.convertToBerlinTime(originalTime);
        String decodedTime = berlinClockService.decodeBerlinTime(berlinTime);

        assertEquals(originalTime, decodedTime, "Round-trip conversion should preserve time");
    }

    @Test
    @DisplayName("Should handle round-trip conversion for various times")
    void testMultipleRoundTripConversions() {
        String[] times = {"00:00:00", "12:00:00", "23:59:00", "06:30:00", "18:45:00"};

        for (String time : times) {
            BerlinClockTime berlinTime = berlinClockService.convertToBerlinTime(time);
            String decoded = berlinClockService.decodeBerlinTime(berlinTime);
            assertEquals(time, decoded, "Round-trip should work for " + time);
        }
    }

    @Test
    @DisplayName("Should throw exception for invalid Berlin Clock format - invalid hours")
    void testDecodeInvalidHours() {
        // 25 hours (5*5 = 25) - invalid
        BerlinClockTime invalidBerlinTime = new BerlinClockTime(
                "Y", "RRRRR", "OOOO", "OOOOOOOOOOO", "OOOO", ""
        );

        assertThrows(IllegalArgumentException.class, () -> {
            berlinClockService.decodeBerlinTime(invalidBerlinTime);
        }, "Should throw exception for invalid hours");
    }

    @Test
    @DisplayName("Should handle seconds lamp correctly - even vs odd")
    void testDecodeSecondsLamp() {
        BerlinClockTime oddSeconds = new BerlinClockTime(
                "Y", "OOOO", "OOOO", "OOOOOOOOOOO", "OOOO", ""
        );
        assertEquals("00:00:01", berlinClockService.decodeBerlinTime(oddSeconds), "Y (ON) should decode to odd seconds (1)");

        BerlinClockTime evenSeconds = new BerlinClockTime(
                "O", "OOOO", "OOOO", "OOOOOOOOOOO", "OOOO", ""
        );
        assertEquals("00:00:00", berlinClockService.decodeBerlinTime(evenSeconds), "O (OFF) should decode to even seconds (0)");
    }
}