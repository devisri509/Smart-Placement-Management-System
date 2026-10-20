package com.placement.system.service;

import com.placement.system.dto.request.JobRequestDTO;
import com.placement.system.dto.response.JobResponseDTO;
import com.placement.system.entity.enums.JobType;
import org.springframework.data.domain.Page;

public interface JobService {
    JobResponseDTO createJob(JobRequestDTO requestDTO);
    JobResponseDTO updateJob(Long id, JobRequestDTO requestDTO);
    JobResponseDTO deactivateJob(Long id);
    void deleteJob(Long id);
    JobResponseDTO getJobById(Long id);
    Page<JobResponseDTO> getOwnRecruiterJobs(int page, int size);
    Page<JobResponseDTO> searchAndFilterJobs(String search, JobType jobType, String branch, Double maxCgpa, Integer gradYear, int page, int size);
}
