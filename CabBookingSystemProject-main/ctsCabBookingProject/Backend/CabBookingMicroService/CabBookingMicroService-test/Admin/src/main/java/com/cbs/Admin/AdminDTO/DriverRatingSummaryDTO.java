package com.cbs.Admin.AdminDTO;

import java.time.LocalDateTime;
import java.util.List;

public class DriverRatingSummaryDTO {
    private Long driverId;
    private Double avgRating;
    private Integer ratingCount;
    private LocalDateTime lastRatedAt;
    private List<String> comments;

    public DriverRatingSummaryDTO(Long driverId, Double avgRating, Integer ratingCount, LocalDateTime lastRatedAt, List<String> comments) {
        this.driverId = driverId;
        this.avgRating = avgRating;
        this.ratingCount = ratingCount;
        this.lastRatedAt = lastRatedAt;
        this.comments = comments;
    }

    public Long getDriverId() { 
    	return driverId; 
    }
    public Double getAvgRating() { 
    	return avgRating; 
    }
    public Integer getRatingCount() { 
    	return ratingCount; 
    }
    public LocalDateTime getLastRatedAt() { 
    	return lastRatedAt; 
    }
    public List<String> getComments() { 
    	return comments; 
    }
}
