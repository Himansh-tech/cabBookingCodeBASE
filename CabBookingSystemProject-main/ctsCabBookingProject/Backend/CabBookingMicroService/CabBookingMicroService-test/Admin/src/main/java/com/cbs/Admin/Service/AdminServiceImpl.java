package com.cbs.Admin.Service;

import com.cbs.Admin.AdminDTO.*;
import com.cbs.Admin.Entity.Admin;
import com.cbs.Admin.Entity.Driver;
import com.cbs.Admin.Entity.DriverRating;
import com.cbs.Admin.Exception.DriverNotFoundException;
import com.cbs.Admin.Exception.DuplicateDriverRegistrationException;
import com.cbs.Admin.Repository.AdminApprovalEntryRepository;
import com.cbs.Admin.Repository.DriverRatingRepository;
import com.cbs.Admin.Repository.DriverRepository;
import com.cbs.Admin.Client.DriverServiceFeignClient;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements IAdminService {

    private final DriverRepository driverRepository;
    private final DriverRatingRepository driverRatingRepository;
    private final AdminApprovalEntryRepository adminApprovalEntryRepository;
    private final DriverServiceFeignClient driverServiceFeignClient;

    @Autowired
    public AdminServiceImpl(
        DriverRepository driverRepository,
        DriverRatingRepository driverRatingRepository,
        AdminApprovalEntryRepository adminApprovalEntryRepository,
        DriverServiceFeignClient driverServiceFeignClient
    ) {
        this.driverRepository = driverRepository;
        this.driverRatingRepository = driverRatingRepository;
        this.adminApprovalEntryRepository = adminApprovalEntryRepository;
        this.driverServiceFeignClient = driverServiceFeignClient;
    }

    @Transactional
    public DriverDTO recordNewDriverForApproval(DriverRegistrationRequestDTO requestDTO) {
        Optional<Driver> existingDriverOptional = driverRepository.findByLicenseNumber(requestDTO.getLicenseNumber());
        if (existingDriverOptional.isPresent()) {
            throw new DuplicateDriverRegistrationException("Driver with license number " + requestDTO.getLicenseNumber() + " already exists.");
        }

        Driver driver = new Driver(
            requestDTO.getName(),
            requestDTO.getLicenseNumber(),
            requestDTO.getVehicleModel(),
            requestDTO.getContactNumber(),
            requestDTO.getDriverId()
        );

        Driver savedDriver = driverRepository.save(driver);
        return convertToDriverDTO(savedDriver);
    }

    @Transactional
    public DriverDTO processDriverApproval(Long driverId, AdminApprovalRequestDTO approvalDTO) {
        Driver driver = driverRepository.findByDriverId(driverId)
            .orElseThrow(() -> new DriverNotFoundException("Driver with ID " + driverId + " not found."));

        driver.setApproved(approvalDTO.getApproved());
        if (approvalDTO.getApproved()) {
            driver.setApprovalDate(LocalDateTime.now());
            driver.setApprovedByAdminId(approvalDTO.getAdminId());
        } else {
            driver.setApprovalDate(null);
            driver.setApprovedByAdminId(null);
        }

        Driver updatedDriver = driverRepository.save(driver);

        Admin approvalEntry = new Admin(
            driverId,
            approvalDTO.getAdminId(),
            approvalDTO.getApproved(),
            approvalDTO.getRemarks()
        );
        adminApprovalEntryRepository.save(approvalEntry);

        DriverApprovalUpdateDTO updateToDriverService = new DriverApprovalUpdateDTO(
            updatedDriver.getLicenseNumber(),
            updatedDriver.isApproved(),
            updatedDriver.getApprovedByAdminId(),
            approvalDTO.getRemarks(),
            updatedDriver.getApprovalDate()
        );
        driverServiceFeignClient.updateDriverApprovalStatus(updateToDriverService);

        return convertToDriverDTO(updatedDriver);
    }

    public List<DriverDTO> getUnapprovedDrivers() {
        return driverRepository.findByIsApprovedFalse().stream()
            .map(this::convertToDriverDTO)
            .collect(Collectors.toList());
    }
    

    public DriverDTO getDriverById(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new DriverNotFoundException("Driver with ID " + driverId + " not found."));
        return convertToDriverDTO(driver);
    }
    

    private DriverDTO convertToDriverDTO(Driver driver) {
        return new DriverDTO(
            driver.getId(),
            driver.getName(),
            driver.getLicenseNumber(),
            driver.getVehicleModel(),
            driver.getContactNumber(),
            driver.isApproved(),
            driver.getDriverId()
        );
    }

    @Transactional
    public void addDriverRating(Long driverId, RatingRequestDTO dto) {
        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        if (dto.getRating() <= 2 && (dto.getComment() == null || dto.getComment().trim().isEmpty())) {
            throw new IllegalArgumentException("Comment is required when rating is 1 or 2.");
        }

        Driver driver = driverRepository.findByDriverId(driverId)
            .orElseThrow(() -> new DriverNotFoundException("Driver with ID " + driverId + " not found."));

        // Save rating entry
        DriverRating rating = new DriverRating();
        rating.setDriverId(driverId);
        rating.setRating(dto.getRating());
        rating.setComment(dto.getComment());
        rating.setCreatedAt(LocalDateTime.now());
        driverRatingRepository.save(rating);

        // Update summary
        int count = driver.getRatingCount() == null ? 0 : driver.getRatingCount();
        double avg = driver.getAvgRating() == null ? 0.0 : driver.getAvgRating();
        double newAvg = ((avg * count) + dto.getRating()) / (count + 1);

        driver.setAvgRating(newAvg);
        driver.setRatingCount(count + 1);
        driver.setLastRatedAt(LocalDateTime.now());
        driverRepository.save(driver);
    }

    public DriverRatingSummaryDTO getDriverRatingSummary(Long driverId) {
        Driver driver = driverRepository.findByDriverId(driverId)
            .orElseThrow(() -> new DriverNotFoundException("Driver with ID " + driverId + " not found."));

        List<String> comments = driverRatingRepository.findTop10ByDriverIdOrderByCreatedAtDesc(driverId)
            .stream()
            .map(DriverRating::getComment)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());

        return new DriverRatingSummaryDTO(
            driverId,
            driver.getAvgRating(),
            driver.getRatingCount(),
            driver.getLastRatedAt(),
            comments
        );
    }

    public List<DriverRatingEntryDTO> getRecentRating(Long driverId) {
        List<DriverRating> ratings = driverRatingRepository.findTop10ByDriverIdOrderByCreatedAtDesc(driverId);
        return ratings.stream()
            .map(r -> new DriverRatingEntryDTO(r.getRating(), r.getComment(), r.getCreatedAt()))
            .collect(Collectors.toList());
    }
}
