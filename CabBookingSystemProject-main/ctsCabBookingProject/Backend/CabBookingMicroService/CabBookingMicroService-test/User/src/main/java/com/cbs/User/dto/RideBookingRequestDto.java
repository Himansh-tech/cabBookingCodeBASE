package com.cbs.User.dto;

public class RideBookingRequestDto {
    private String pickupLocation;

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDropoffLocation() {
        return dropoffLocation;
    }

    public void setDropoffLocation(String dropoffLocation) {
        this.dropoffLocation = dropoffLocation;
    }

    public float getActualFare() {
        return actualFare;
    }

    public void setActualFare(float actualFare) {
        this.actualFare = actualFare;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    private String dropoffLocation;
    private float actualFare; // Match type from frontend (double for fare)
    private String distance;      // Match type from frontend (double for distance in km)
    private String duration;         // Match type from frontend (int for duration in minutes)

}
