package com.gazapharma.pharma_search.service;

import com.gazapharma.pharma_search.exception.InvalidLocationException;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

    public void validateCoordinates(double lat, double lng) {
        if (lat < -90 || lat > 90) {
            throw new InvalidLocationException("Invalid latitude. Must be between -90 and 90");
        }
        if (lng < -180 || lng > 180) {
            throw new InvalidLocationException("Invalid longitude. Must be between -180 and 180");
        }
    }

    public String getNearbyPharmacies(double lat, double lng) {
        validateCoordinates(lat, lng);
        return "Nearby pharmacies found successfully";
    }
}

