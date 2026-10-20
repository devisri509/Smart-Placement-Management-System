package com.placement.system.controller;

import com.placement.system.dto.ApiResponse;
import com.placement.system.dto.request.JobRequestDTO;
import com.placement.system.dto.response.JobResponseDTO;
import com.placement.system.entity.enums.JobType;
import com.placement.system.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse<JobResponseDTO>> createJob(@Valid @RequestBody JobRequestDTO requestDTO) {
        JobResponseDTO job = jobService.createJob(requestDTO);
        return new ResponseEntity<>(ApiResponse.success("Job posting created successfully", job), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_RECRUITER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<JobResponseDTO>> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequestDTO requestDTO) {
        JobResponseDTO job = jobService.updateJob(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Job posting updated successfully", job));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasAnyAuthority('ROLE_RECRUITER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<JobResponseDTO>> deactivateJob(@PathVariable Long id) {
        JobResponseDTO job = jobService.deactivateJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job posting deactivated successfully", job));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_RECRUITER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job posting deleted successfully", null));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<JobResponseDTO>> getJobById(@PathVariable Long id) {
        JobResponseDTO job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success("Job details retrieved successfully", job));
    }

    @GetMapping({"/my-jobs", "/recruiter/my-jobs"})
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse<Page<JobResponseDTO>>> getOwnRecruiterJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<JobResponseDTO> jobs = jobService.getOwnRecruiterJobs(page, size);
        return ResponseEntity.ok(ApiResponse.success("Recruiter job postings retrieved successfully", jobs));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<JobResponseDTO>>> searchAndFilterJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) Double maxCgpa,
            @RequestParam(required = false) Integer gradYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<JobResponseDTO> jobs = jobService.searchAndFilterJobs(search, jobType, branch, maxCgpa, gradYear, page, size);
        return ResponseEntity.ok(ApiResponse.success("Active job listings retrieved successfully", jobs));
    }
}
