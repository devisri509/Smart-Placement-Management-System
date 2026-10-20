package com.placement.system.service.impl;

import com.placement.system.dto.request.JobRequestDTO;
import com.placement.system.dto.request.JobSkillRequestDTO;
import com.placement.system.dto.response.JobResponseDTO;
import com.placement.system.dto.response.JobSkillResponseDTO;
import com.placement.system.dto.response.RecruiterResponseDTO;
import com.placement.system.dto.response.SkillCategoryResponseDTO;
import com.placement.system.dto.response.SkillResponseDTO;
import com.placement.system.entity.Job;
import com.placement.system.entity.JobSkill;
import com.placement.system.entity.Recruiter;
import com.placement.system.entity.Skill;
import com.placement.system.entity.enums.JobType;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.repository.JobRepository;
import com.placement.system.repository.RecruiterRepository;
import com.placement.system.repository.SkillRepository;
import com.placement.system.security.SecurityUtils;
import com.placement.system.service.JobService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final RecruiterRepository recruiterRepository;
    private final SkillRepository skillRepository;
    private final SecurityUtils securityUtils;
    private final RecruiterServiceImpl recruiterService;

    public JobServiceImpl(JobRepository jobRepository,
                          RecruiterRepository recruiterRepository,
                          SkillRepository skillRepository,
                          SecurityUtils securityUtils,
                          RecruiterServiceImpl recruiterService) {
        this.jobRepository = jobRepository;
        this.recruiterRepository = recruiterRepository;
        this.skillRepository = skillRepository;
        this.securityUtils = securityUtils;
        this.recruiterService = recruiterService;
    }

    @Override
    public JobResponseDTO createJob(JobRequestDTO requestDTO) {
        Long currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new AccessDeniedException("Authentication required to post job opening.");
        }

        Recruiter recruiter = recruiterRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for authenticated user."));

        Job job = Job.builder()
                .recruiter(recruiter)
                .title(requestDTO.getTitle())
                .description(requestDTO.getDescription())
                .location(requestDTO.getLocation())
                .jobType(requestDTO.getJobType())
                .packageOrStipend(requestDTO.getPackageOrStipend())
                .minCgpa(requestDTO.getMinCgpa() != null ? requestDTO.getMinCgpa() : 0.0)
                .allowedBranches(requestDTO.getAllowedBranches() != null ? requestDTO.getAllowedBranches() : "CSE,IT,ECE,EEE,MECH,CIVIL")
                .minGraduationYear(requestDTO.getMinGraduationYear())
                .maxBacklogsAllowed(requestDTO.getMaxBacklogsAllowed() != null ? requestDTO.getMaxBacklogsAllowed() : 0)
                .openings(requestDTO.getOpenings() != null ? requestDTO.getOpenings() : 1)
                .active(true)
                .deadline(requestDTO.getDeadline())
                .build();

        if (requestDTO.getRequiredSkills() != null && !requestDTO.getRequiredSkills().isEmpty()) {
            for (JobSkillRequestDTO skillReq : requestDTO.getRequiredSkills()) {
                Skill skill = skillRepository.findById(skillReq.getSkillId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillReq.getSkillId()));

                JobSkill jobSkill = JobSkill.builder()
                        .job(job)
                        .skill(skill)
                        .mandatory(skillReq.isMandatory())
                        .minimumProficiency(skillReq.getMinimumProficiency())
                        .build();

                job.getJobSkills().add(jobSkill);
            }
        }

        Job savedJob = jobRepository.save(job);
        return mapToResponseDTO(savedJob);
    }

    @Override
    public JobResponseDTO updateJob(Long id, JobRequestDTO requestDTO) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + id));

        securityUtils.validateUserOwnershipOrAdmin(job.getRecruiter().getUser().getId());

        job.setTitle(requestDTO.getTitle());
        job.setDescription(requestDTO.getDescription());
        job.setLocation(requestDTO.getLocation());
        job.setJobType(requestDTO.getJobType());
        if (requestDTO.getPackageOrStipend() != null) job.setPackageOrStipend(requestDTO.getPackageOrStipend());
        if (requestDTO.getMinCgpa() != null) job.setMinCgpa(requestDTO.getMinCgpa());
        if (requestDTO.getAllowedBranches() != null) job.setAllowedBranches(requestDTO.getAllowedBranches());
        if (requestDTO.getMinGraduationYear() != null) job.setMinGraduationYear(requestDTO.getMinGraduationYear());
        if (requestDTO.getMaxBacklogsAllowed() != null) job.setMaxBacklogsAllowed(requestDTO.getMaxBacklogsAllowed());
        if (requestDTO.getOpenings() != null) job.setOpenings(requestDTO.getOpenings());
        if (requestDTO.getDeadline() != null) job.setDeadline(requestDTO.getDeadline());

        if (requestDTO.getRequiredSkills() != null) {
            job.getJobSkills().clear();
            jobRepository.saveAndFlush(job);

            for (JobSkillRequestDTO skillReq : requestDTO.getRequiredSkills()) {
                Skill skill = skillRepository.findById(skillReq.getSkillId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillReq.getSkillId()));

                JobSkill jobSkill = JobSkill.builder()
                        .job(job)
                        .skill(skill)
                        .mandatory(skillReq.isMandatory())
                        .minimumProficiency(skillReq.getMinimumProficiency())
                        .build();

                job.getJobSkills().add(jobSkill);
            }
        }

        Job updatedJob = jobRepository.save(job);
        return mapToResponseDTO(updatedJob);
    }

    @Override
    public JobResponseDTO deactivateJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + id));

        securityUtils.validateUserOwnershipOrAdmin(job.getRecruiter().getUser().getId());
        job.setActive(false);

        Job savedJob = jobRepository.save(job);
        return mapToResponseDTO(savedJob);
    }

    @Override
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + id));

        securityUtils.validateUserOwnershipOrAdmin(job.getRecruiter().getUser().getId());
        jobRepository.delete(job);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponseDTO getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + id));
        return mapToResponseDTO(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDTO> getOwnRecruiterJobs(int page, int size) {
        Long currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new AccessDeniedException("Authentication required.");
        }

        Recruiter recruiter = recruiterRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for authenticated user."));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return jobRepository.findByRecruiter(recruiter, pageable).map(this::mapToResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDTO> searchAndFilterJobs(String search, JobType jobType, String branch, Double maxCgpa, Integer gradYear, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        LocalDateTime now = LocalDateTime.now();

        return jobRepository.searchAndFilterJobs(
                now,
                (search != null && !search.isBlank()) ? search.trim() : null,
                jobType,
                (branch != null && !branch.isBlank()) ? branch.trim() : null,
                maxCgpa,
                gradYear,
                pageable
        ).map(this::mapToResponseDTO);
    }

    public JobResponseDTO mapToResponseDTO(Job job) {
        RecruiterResponseDTO recruiterDTO = (job.getRecruiter() != null) ?
                recruiterService.mapToResponseDTO(job.getRecruiter()) : null;

        List<JobSkillResponseDTO> skillDTOs = (job.getJobSkills() != null) ?
                job.getJobSkills().stream().map(js -> JobSkillResponseDTO.builder()
                        .id(js.getId())
                        .skill(js.getSkill() != null ? SkillResponseDTO.builder()
                                .id(js.getSkill().getId())
                                .name(js.getSkill().getName())
                                .description(js.getSkill().getDescription())
                                .createdAt(js.getSkill().getCreatedAt())
                                .category(js.getSkill().getCategory() != null ? SkillCategoryResponseDTO.builder()
                                        .id(js.getSkill().getCategory().getId())
                                        .name(js.getSkill().getCategory().getName())
                                        .description(js.getSkill().getCategory().getDescription())
                                        .build() : null)
                                .build() : null)
                        .mandatory(js.isMandatory())
                        .minimumProficiency(js.getMinimumProficiency())
                        .build()).collect(Collectors.toList()) : List.of();

        return JobResponseDTO.builder()
                .id(job.getId())
                .recruiter(recruiterDTO)
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .packageOrStipend(job.getPackageOrStipend())
                .minCgpa(job.getMinCgpa())
                .allowedBranches(job.getAllowedBranches())
                .minGraduationYear(job.getMinGraduationYear())
                .maxBacklogsAllowed(job.getMaxBacklogsAllowed())
                .openings(job.getOpenings())
                .active(job.isActive())
                .deadline(job.getDeadline())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .requiredSkills(skillDTOs)
                .build();
    }
}
