package com.carapax.berlinclock.controller;

import com.carapax.berlinclock.model.BerlinClockTime;
import com.carapax.berlinclock.service.BerlinClockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Berlin Clock API endpoints.
 * Provides current time in Berlin Clock format.
 *
 * @author Jose Benitez
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BerlinClockController {

    private final BerlinClockService berlinClockService;

    public BerlinClockController(BerlinClockService berlinClockService) {
        this.berlinClockService = berlinClockService;
    }

    /**
     * GET endpoint that returns the current time in Berlin Clock format.
     * This endpoint is designed to be called every second by the frontend.
     *
     * @return BerlinClockTime JSON response with current time
     */
    @GetMapping("/time")
    public ResponseEntity<BerlinClockTime> getCurrentTime() {
        BerlinClockTime berlinTime = berlinClockService.getCurrentBerlinTime();
        return ResponseEntity.ok(berlinTime);
    }

    /**
     * GET endpoint that converts a specific time to Berlin Clock format.
     * Useful for testing specific times.
     *
     * @param time time string in HH:mm:ss format
     * @return BerlinClockTime JSON response
     */
    @GetMapping("/time/convert")
    public ResponseEntity<BerlinClockTime> convertTime(@RequestParam String time) {
        try {
            BerlinClockTime berlinTime = berlinClockService.convertToBerlinTime(time);
            return ResponseEntity.ok(berlinTime);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST endpoint that decodes a Berlin Clock format to standard time.
     * Accepts a BerlinClockTime object and returns the decoded time string.
     *
     * @param berlinClockTime the Berlin Clock format to decode
     * @return JSON response with decoded time string
     */
    @PostMapping("/time/decode")
    public ResponseEntity<DecodeResponse> decodeBerlinTime(@RequestBody BerlinClockTime berlinClockTime) {
        try {
            String decodedTime = berlinClockService.decodeBerlinTime(berlinClockTime);
            return ResponseEntity.ok(new DecodeResponse(decodedTime));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Simple response wrapper for decoded time
     */
    private record DecodeResponse(String time) {}
}