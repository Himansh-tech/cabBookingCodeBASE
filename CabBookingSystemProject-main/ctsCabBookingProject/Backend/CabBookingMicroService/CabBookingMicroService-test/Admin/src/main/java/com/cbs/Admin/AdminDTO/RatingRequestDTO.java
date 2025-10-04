package com.cbs.Admin.AdminDTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class RatingRequestDTO {
    @Min(1) @Max(5)
    private int rating;
    private String comment;
    private String rideId;

    public int getRating() { 
    	return rating; 
    }
    public void setRating(int rating) { 
    	this.rating = rating; 
    }

    public String getComment() { 
    	return comment; 
    }
    public void setComment(String comment) { 
    	this.comment = comment; 
    }

    public String getRideId() { 
    	return rideId; 
    }
    public void setRideId(String rideId) { 
    	this.rideId = rideId; 
    }
}
