package com.cbs.Admin.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cbs.Admin.AdminDTO.RatingRequestDTO;
import com.cbs.Admin.AdminDTO.DriverRatingSummaryDTO;


import com.cbs.Admin.AdminDTO.AdminApprovalRequestDTO;
import com.cbs.Admin.AdminDTO.DriverDTO;
import com.cbs.Admin.AdminDTO.DriverRatingEntryDTO;
import com.cbs.Admin.AdminDTO.DriverRegistrationRequestDTO;
import com.cbs.Admin.Exception.DriverNotFoundException;
import com.cbs.Admin.Exception.DuplicateDriverRegistrationException;
import com.cbs.Admin.Service.IAdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/admin")
public class AdminController {
    private final IAdminService adminService;
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    public AdminController(IAdminService adminService) {
        this.adminService = adminService;
    }


    @PostMapping("/receive-registration")
    public ResponseEntity<DriverDTO> receiveDriverRegistrationForApproval(@Valid @RequestBody DriverRegistrationRequestDTO requestDTO) {
        try {
            DriverDTO recordedDriver = adminService.recordNewDriverForApproval(requestDTO);
            return new ResponseEntity<>(recordedDriver, HttpStatus.CREATED);
        } catch (DuplicateDriverRegistrationException e) {
            // The @ResponseStatus on DuplicateDriverRegistrationException handles the 409
            throw e;
        }
    }


    @GetMapping("/unapproved")
    public ResponseEntity<List<DriverDTO>> getUnapprovedDrivers() {
        logger.debug("Fetching list of unapproved drivers");
        List<DriverDTO> unapprovedDrivers = adminService.getUnapprovedDrivers();
        return ResponseEntity.ok(unapprovedDrivers);
    }


    @GetMapping("/{driverId}")
    public ResponseEntity<DriverDTO> getDriverById(@PathVariable Long driverId) {
        try {
            DriverDTO driver = adminService.getDriverById(driverId);
            return ResponseEntity.ok(driver);
        } catch (DriverNotFoundException e) {
            throw e;
        }
    }


    @PutMapping("/{driverId}/process-approval")
    public ResponseEntity<DriverDTO> processDriverApproval(
            @PathVariable Long driverId,
            @Valid @RequestBody AdminApprovalRequestDTO approvalDTO) {
        try {
            DriverDTO updatedDriver = adminService.processDriverApproval(driverId, approvalDTO);
            return ResponseEntity.ok(updatedDriver);
        } catch (DriverNotFoundException e)  {
            throw e;
        }
    }
    
    
    
    @PostMapping("/drivers/{driverId}/ratings")
    public ResponseEntity<Void> addDriverRating(@PathVariable Long driverId,@Valid @RequestBody RatingRequestDTO ratingRequestDTO
    ) {
        try {
            adminService.addDriverRating(driverId, ratingRequestDTO);
            logger.debug("Fetching Driver Profile");
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (DriverNotFoundException e) {
            throw e;
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/drivers/{driverId}/ratings/summary")
    public ResponseEntity<DriverRatingSummaryDTO> getDriverRatingSummary(@PathVariable Long driverId) {
        try {
            DriverRatingSummaryDTO dto = adminService.getDriverRatingSummary(driverId);
            return ResponseEntity.ok(dto);
        } catch (DriverNotFoundException e) {
            throw e;
        }
    }
    
    @GetMapping("/drivers/{driverId}/ratings/recent")
    public ResponseEntity<List<DriverRatingEntryDTO>> getRecentRating(@PathVariable Long driverId) {
        return ResponseEntity.ok(adminService.getRecentRating(driverId));
    }

}
