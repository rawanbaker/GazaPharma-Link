package com.gazapharma.pharma_search.controller;

import com.gazapharma.pharma_search.exception.InvalidLocationException;
import com.gazapharma.pharma_search.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyPharmacies(
            @RequestParam double lat,
            @RequestParam double lng) {

        try {
            String result = locationService.getNearbyPharmacies(lat, lng);
            return ResponseEntity.ok(result);
        } catch (InvalidLocationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error, please try again");
        }
    }
}