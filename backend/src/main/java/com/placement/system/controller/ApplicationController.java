package com.placement.system.controller;

import com.placement.system.dto.ApiResponse;
import com.placement.system.dto.request.ApplicationStatusUpdateDTO;
import com.placement.system.dto.response.ApplicationResponseDTO;
import com.placement.system.dto.response.ApplicationStatusHistoryResponseDTO;
import com.placement.system.dto.response.CandidateProfileResponseDTO;
import com.placement.system.entity.enums.ApplicationStatus;
import com.placement.system.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<ApplicationResponseDTO>> applyForJob(@RequestParam Long jobId) {
        ApplicationResponseDTO application = applicationService.applyForJob(jobId);
        return new ResponseEntity<>(ApiResponse.success("Job application submitted successfully", application), HttpStatus.CREATED);
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<Page<ApplicationResponseDTO>>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ApplicationResponseDTO> applications = applicationService.getMyApplications(page, size);
        return ResponseEntity.ok(ApiResponse.success("Student applications retrieved successfully", applications));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ApplicationResponseDTO>> getApplicationById(@PathVariable Long id) {
        ApplicationResponseDTO application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success("Application details retrieved successfully", application));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyAuthority('ROLE_RECRUITER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Page<ApplicationResponseDTO>>> getApplicantsForJob(
            @PathVariable Long jobId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ApplicationResponseDTO> applicants = applicationService.getApplicantsForJob(jobId, status, page, size);
        return ResponseEntity.ok(ApiResponse.success("Applicants retrieved successfully", applicants));
    }

    @GetMapping("/{id}/candidate-profile")
    @PreAuthorize("hasAnyAuthority('ROLE_RECRUITER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<CandidateProfileResponseDTO>> getCandidateProfileForApplication(@PathVariable Long id) {
        CandidateProfileResponseDTO candidateProfile = applicationService.getCandidateProfileForApplication(id);
        return ResponseEntity.ok(ApiResponse.success("Candidate profile retrieved successfully", candidateProfile));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_RECRUITER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationResponseDTO>> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateDTO statusUpdateDTO) {
        ApplicationResponseDTO updatedApplication = applicationService.updateApplicationStatus(id, statusUpdateDTO);
        return ResponseEntity.ok(ApiResponse.success("Application status updated successfully", updatedApplication));
    }

    @GetMapping("/{id}/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ApplicationStatusHistoryResponseDTO>>> getApplicationStatusHistory(@PathVariable Long id) {
        List<ApplicationStatusHistoryResponseDTO> history = applicationService.getApplicationStatusHistory(id);
        return ResponseEntity.ok(ApiResponse.success("Application status history retrieved successfully", history));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Page<ApplicationResponseDTO>>> getAllApplications(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ApplicationResponseDTO> applications = applicationService.getAllApplications(status, page, size);
        return ResponseEntity.ok(ApiResponse.success("All applications retrieved successfully", applications));
    }
}
