package com.placement.system.service;

import com.placement.system.dto.request.ApplicationStatusUpdateDTO;
import com.placement.system.dto.response.ApplicationResponseDTO;
import com.placement.system.dto.response.ApplicationStatusHistoryResponseDTO;
import com.placement.system.dto.response.CandidateProfileResponseDTO;
import com.placement.system.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ApplicationService {
    ApplicationResponseDTO applyForJob(Long jobId);
    Page<ApplicationResponseDTO> getMyApplications(int page, int size);
    ApplicationResponseDTO getApplicationById(Long id);
    Page<ApplicationResponseDTO> getApplicantsForJob(Long jobId, ApplicationStatus status, int page, int size);
    CandidateProfileResponseDTO getCandidateProfileForApplication(Long applicationId);
    ApplicationResponseDTO updateApplicationStatus(Long applicationId, ApplicationStatusUpdateDTO statusUpdateDTO);
    List<ApplicationStatusHistoryResponseDTO> getApplicationStatusHistory(Long applicationId);
    Page<ApplicationResponseDTO> getAllApplications(ApplicationStatus status, int page, int size);
}
