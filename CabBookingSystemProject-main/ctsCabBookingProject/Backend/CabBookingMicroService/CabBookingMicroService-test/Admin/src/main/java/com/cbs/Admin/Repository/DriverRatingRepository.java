package com.cbs.Admin.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cbs.Admin.Entity.DriverRating;

@Repository
public interface DriverRatingRepository extends JpaRepository<DriverRating, Long> {
    List<DriverRating> findTop10ByDriverIdOrderByCreatedAtDesc(Long driverId);
}
