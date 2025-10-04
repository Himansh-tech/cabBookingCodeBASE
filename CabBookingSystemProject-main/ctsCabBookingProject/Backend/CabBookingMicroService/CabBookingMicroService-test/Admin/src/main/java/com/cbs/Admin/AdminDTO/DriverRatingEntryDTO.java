package com.cbs.Admin.AdminDTO;

import java.time.LocalDateTime;

public class DriverRatingEntryDTO {
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    public DriverRatingEntryDTO(int rating, String comment, LocalDateTime createdAt) {
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}