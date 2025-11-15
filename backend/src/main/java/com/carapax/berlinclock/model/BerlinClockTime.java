package com.carapax.berlinclock.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents the Berlin Clock time display.
 * The Berlin Clock (Mengenlehreuhr) shows time using colored lamps:
 * - 1 yellow lamp for seconds (on if even, off if odd)
 * - 2 rows of 4 red lamps each for hours (top = 5-hour blocks, bottom = 1-hour blocks)
 * - 2 rows for minutes: top row 11 lamps (5-minute blocks), bottom row 4 lamps (1-minute blocks)
 *
 * @author Jose Benitez
 */
public class BerlinClockTime {

    @JsonProperty("secondsLamp")
    private String secondsLamp;

    @JsonProperty("fiveHoursRow")
    private String fiveHoursRow;

    @JsonProperty("singleHoursRow")
    private String singleHoursRow;

    @JsonProperty("fiveMinutesRow")
    private String fiveMinutesRow;

    @JsonProperty("singleMinutesRow")
    private String singleMinutesRow;

    @JsonProperty("currentTime")
    private String currentTime;

    public BerlinClockTime() {
    }

    public BerlinClockTime(String secondsLamp, String fiveHoursRow, String singleHoursRow,
                           String fiveMinutesRow, String singleMinutesRow, String currentTime) {
        this.secondsLamp = secondsLamp;
        this.fiveHoursRow = fiveHoursRow;
        this.singleHoursRow = singleHoursRow;
        this.fiveMinutesRow = fiveMinutesRow;
        this.singleMinutesRow = singleMinutesRow;
        this.currentTime = currentTime;
    }

    public String getSecondsLamp() {
        return secondsLamp;
    }

    public void setSecondsLamp(String secondsLamp) {
        this.secondsLamp = secondsLamp;
    }

    public String getFiveHoursRow() {
        return fiveHoursRow;
    }

    public void setFiveHoursRow(String fiveHoursRow) {
        this.fiveHoursRow = fiveHoursRow;
    }

    public String getSingleHoursRow() {
        return singleHoursRow;
    }

    public void setSingleHoursRow(String singleHoursRow) {
        this.singleHoursRow = singleHoursRow;
    }

    public String getFiveMinutesRow() {
        return fiveMinutesRow;
    }

    public void setFiveMinutesRow(String fiveMinutesRow) {
        this.fiveMinutesRow = fiveMinutesRow;
    }

    public String getSingleMinutesRow() {
        return singleMinutesRow;
    }

    public void setSingleMinutesRow(String singleMinutesRow) {
        this.singleMinutesRow = singleMinutesRow;
    }

    public String getCurrentTime() {
        return currentTime;
    }

    public void setCurrentTime(String currentTime) {
        this.currentTime = currentTime;
    }

    @Override
    public String toString() {
        return "BerlinClockTime{" +
                "secondsLamp='" + secondsLamp + '\'' +
                ", fiveHoursRow='" + fiveHoursRow + '\'' +
                ", singleHoursRow='" + singleHoursRow + '\'' +
                ", fiveMinutesRow='" + fiveMinutesRow + '\'' +
                ", singleMinutesRow='" + singleMinutesRow + '\'' +
                ", currentTime='" + currentTime + '\'' +
                '}';
    }
}