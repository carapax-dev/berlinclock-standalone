package com.carapax.berlinclock.service;

import com.carapax.berlinclock.model.BerlinClockTime;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * Service for converting standard time to Berlin Clock format.
 * Follows Single Responsibility Principle - only handles time conversion logic.
 *
 * @author Jose Benitez
 */
@Service
public class BerlinClockService {

    private static final char YELLOW = 'Y';
    private static final char RED = 'R';
    private static final char OFF = 'O';
    private static final int LAMPS_PER_HOUR_ROW = 4;
    private static final int LAMPS_PER_MINUTE_ROW = 4;
    private static final int LAMPS_PER_FIVE_MINUTE_ROW = 11;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    /**
     * Converts the current system time to Berlin Clock format
     *
     * @return BerlinClockTime representation of current time
     */
    public BerlinClockTime getCurrentBerlinTime() {
        LocalTime now = LocalTime.now();
        return convertToBerlinTime(now);
    }

    /**
     * Converts a LocalTime to Berlin Clock format
     *
     * @param time the time to convert
     * @return BerlinClockTime representation
     */
    public BerlinClockTime convertToBerlinTime(LocalTime time) {
        int hours = time.getHour();
        int minutes = time.getMinute();
        int seconds = time.getSecond();

        return new BerlinClockTime(
                getSecondsLamp(seconds),
                getFiveHoursRow(hours),
                getSingleHoursRow(hours),
                getFiveMinutesRow(minutes),
                getSingleMinutesRow(minutes),
                time.format(TIME_FORMATTER)
        );
    }

    /**
     * Converts a time string (HH:mm:ss) to Berlin Clock format
     *
     * @param timeString time in HH:mm:ss format
     * @return BerlinClockTime representation
     * @throws IllegalArgumentException if time format is invalid
     */
    public BerlinClockTime convertToBerlinTime(String timeString) {
        try {
            LocalTime time = LocalTime.parse(timeString, TIME_FORMATTER);
            return convertToBerlinTime(time);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid time format. Expected HH:mm:ss", e);
        }
    }

    /**
     * Decodes a Berlin Clock format back to standard time format.
     * Since the seconds lamp only indicates even/odd, we assume 1 for odd seconds (Y) and 0 for even (O).
     *
     * @param berlinClockTime the Berlin Clock time to decode
     * @return time string in HH:mm:ss format
     * @throws IllegalArgumentException if the Berlin Clock format is invalid
     */
    public String decodeBerlinTime(BerlinClockTime berlinClockTime) {
        try {
            // Decode hours
            int fiveHours = countLampsOn(berlinClockTime.getFiveHoursRow());
            int singleHours = countLampsOn(berlinClockTime.getSingleHoursRow());
            int hours = (fiveHours * 5) + singleHours;

            // Decode minutes
            int fiveMinutes = countLampsOn(berlinClockTime.getFiveMinutesRow());
            int singleMinutes = countLampsOn(berlinClockTime.getSingleMinutesRow());
            int minutes = (fiveMinutes * 5) + singleMinutes;

            // Decode seconds - we can only determine if even or odd
            // Y = odd seconds (1), O = even seconds (0)
            int seconds = berlinClockTime.getSecondsLamp().equals("Y") ? 1 : 0;

            // Validate ranges
            if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
                throw new IllegalArgumentException("Decoded time values are out of valid range");
            }

            LocalTime time = LocalTime.of(hours, minutes, seconds);
            return time.format(TIME_FORMATTER);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid Berlin Clock format", e);
        }
    }

    /**
     * Decodes a Berlin Clock format provided as individual strings.
     *
     * @param secondsLamp the seconds lamp (Y or O)
     * @param fiveHoursRow the five hours row
     * @param singleHoursRow the single hours row
     * @param fiveMinutesRow the five minutes row
     * @param singleMinutesRow the single minutes row
     * @return time string in HH:mm:ss format
     * @throws IllegalArgumentException if the Berlin Clock format is invalid
     */
    public String decodeBerlinTime(String secondsLamp, String fiveHoursRow, String singleHoursRow,
                                    String fiveMinutesRow, String singleMinutesRow) {
        BerlinClockTime berlinClockTime = new BerlinClockTime(
                secondsLamp, fiveHoursRow, singleHoursRow, fiveMinutesRow, singleMinutesRow, ""
        );
        return decodeBerlinTime(berlinClockTime);
    }

    /**
     * Counts the number of lamps that are on (not 'O') in a row.
     *
     * @param lampRow the lamp row string
     * @return number of lamps that are on
     */
    private int countLampsOn(String lampRow) {
        if (lampRow == null) {
            return 0;
        }
        return (int) lampRow.chars().filter(c -> c != OFF).count();
    }

    /**
     * Returns the seconds lamp status.
     * Yellow (Y) if seconds are odd, Off (O) if even.
     *
     * @param seconds current seconds
     * @return "Y" or "O"
     */
    private String getSecondsLamp(int seconds) {
        return seconds % 2 != 0 ? String.valueOf(YELLOW) : String.valueOf(OFF);
    }

    /**
     * Returns the five-hours row (top hours row).
     * Each lamp represents 5 hours. All lamps are red.
     *
     * @param hours current hours (0-23)
     * @return String of 4 characters (R or O)
     */
    private String getFiveHoursRow(int hours) {
        int lampsOn = hours / 5;
        return buildLampRow(LAMPS_PER_HOUR_ROW, lampsOn, RED);
    }

    /**
     * Returns the single-hours row (bottom hours row).
     * Each lamp represents 1 hour. All lamps are red.
     *
     * @param hours current hours (0-23)
     * @return String of 4 characters (R or O)
     */
    private String getSingleHoursRow(int hours) {
        int lampsOn = hours % 5;
        return buildLampRow(LAMPS_PER_HOUR_ROW, lampsOn, RED);
    }

    /**
     * Returns the five-minutes row (top minutes row).
     * Each lamp represents 5 minutes. Every 3rd lamp (positions 2, 5, 8) is red, others are yellow.
     *
     * @param minutes current minutes (0-59)
     * @return String of 11 characters (Y, R, or O)
     */
    private String getFiveMinutesRow(int minutes) {
        int lampsOn = minutes / 5;
        StringBuilder row = new StringBuilder();

        for (int i = 0; i < LAMPS_PER_FIVE_MINUTE_ROW; i++) {
            if (i < lampsOn) {
                // Every 3rd lamp (index 2, 5, 8) is red, others are yellow
                row.append((i + 1) % 3 == 0 ? RED : YELLOW);
            } else {
                row.append(OFF);
            }
        }

        return row.toString();
    }

    /**
     * Returns the single-minutes row (bottom minutes row).
     * Each lamp represents 1 minute. All lamps are yellow.
     *
     * @param minutes current minutes (0-59)
     * @return String of 4 characters (Y or O)
     */
    private String getSingleMinutesRow(int minutes) {
        int lampsOn = minutes % 5;
        return buildLampRow(LAMPS_PER_MINUTE_ROW, lampsOn, YELLOW);
    }

    /**
     * Builds a lamp row string with specified number of lamps on and color.
     *
     * @param totalLamps total number of lamps in the row
     * @param lampsOn    number of lamps that should be on
     * @param onColor    color character for lamps that are on
     * @return String representation of the lamp row
     */
    private String buildLampRow(int totalLamps, int lampsOn, char onColor) {
        StringBuilder row = new StringBuilder();

        for (int i = 0; i < totalLamps; i++) {
            row.append(i < lampsOn ? onColor : OFF);
        }

        return row.toString();
    }
}