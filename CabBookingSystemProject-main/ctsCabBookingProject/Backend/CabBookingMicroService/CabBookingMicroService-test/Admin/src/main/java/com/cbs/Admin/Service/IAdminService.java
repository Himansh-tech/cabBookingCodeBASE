package com.cbs.Admin.Service;

import com.cbs.Admin.AdminDTO.RatingRequestDTO;
import com.cbs.Admin.AdminDTO.DriverRatingSummaryDTO;


import com.cbs.Admin.AdminDTO.AdminApprovalRequestDTO;
import com.cbs.Admin.AdminDTO.DriverDTO;
import com.cbs.Admin.AdminDTO.DriverRatingEntryDTO;
import com.cbs.Admin.AdminDTO.DriverRegistrationRequestDTO;
import com.cbs.Admin.Exception.DriverNotFoundException;
import com.cbs.Admin.Exception.DuplicateDriverRegistrationException;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface IAdminService {

    DriverDTO recordNewDriverForApproval(DriverRegistrationRequestDTO requestDTO) throws DuplicateDriverRegistrationException;


    DriverDTO processDriverApproval(Long driverId, AdminApprovalRequestDTO approvalDTO) throws DriverNotFoundException;

    List<DriverDTO> getUnapprovedDrivers();

    DriverDTO getDriverById(Long driverId) throws DriverNotFoundException;
    
    List<DriverRatingEntryDTO> getRecentRating(Long driverId);
    
    void addDriverRating(Long driverId, RatingRequestDTO dto);
    DriverRatingSummaryDTO getDriverRatingSummary(Long driverId);

}
