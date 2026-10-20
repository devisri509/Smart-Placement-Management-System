package com.placement.system.service.impl;

import com.placement.system.dto.request.ApplicationStatusUpdateDTO;
import com.placement.system.dto.response.*;
import com.placement.system.entity.*;
import com.placement.system.entity.enums.ApplicationStatus;
import com.placement.system.exception.DuplicateResourceException;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.repository.*;
import com.placement.system.security.SecurityUtils;
import com.placement.system.service.ApplicationService;
import com.placement.system.service.PlacementIntelligenceService;
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
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final PlacementIntelligenceService intelligenceService;
    private final StudentServiceImpl studentService;
    private final JobServiceImpl jobService;
    private final StudentSkillServiceImpl studentSkillService;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                  ApplicationStatusHistoryRepository statusHistoryRepository,
                                  StudentRepository studentRepository,
                                  JobRepository jobRepository,
                                  UserRepository userRepository,
                                  SecurityUtils securityUtils,
                                  PlacementIntelligenceService intelligenceService,
                                  StudentServiceImpl studentService,
                                  JobServiceImpl jobService,
                                  StudentSkillServiceImpl studentSkillService) {
        this.applicationRepository = applicationRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.securityUtils = securityUtils;
        this.intelligenceService = intelligenceService;
        this.studentService = studentService;
        this.jobService = jobService;
        this.studentSkillService = studentSkillService;
    }

    @Override
    public ApplicationResponseDTO applyForJob(Long jobId) {
        Long currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new AccessDeniedException("Authentication required to submit job application.");
        }

        Student student = studentRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for authenticated user."));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + jobId));

        // Rule 1: Prevent applications to inactive jobs
        if (!job.isActive()) {
            throw new IllegalArgumentException("Cannot apply to inactive job posting.");
        }

        // Rule 2: Prevent applications after deadline
        if (job.getDeadline().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Application deadline has expired for this job posting (" + job.getDeadline() + ").");
        }

        // Rule 3: Prevent duplicate applications
        if (applicationRepository.existsByStudentAndJob(student, job)) {
            throw new DuplicateResourceException("You have already submitted an application for this job posting.");
        }

        // Rule 4: Student must be eligible before applying
        EligibilityResponseDTO eligibility = intelligenceService.checkEligibility(student.getId(), jobId);
        if (!eligibility.isEligible()) {
            String failedReasons = String.join("; ", eligibility.getFailedCriteria());
            throw new IllegalArgumentException("Application rejected due to ineligibility: " + failedReasons);
        }

        // Compute Skill Match Percentage
        SkillMatchResponseDTO skillMatch = intelligenceService.calculateSkillMatch(student.getId(), jobId);

        Application application = Application.builder()
                .student(student)
                .job(job)
                .status(ApplicationStatus.APPLIED)
                .skillMatchPercentage(skillMatch.getMatchPercentage())
                .build();

        Application savedApp = applicationRepository.save(application);

        // Record initial status in status history audit log
        User currentUser = userRepository.findById(currentUserId).orElse(null);
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(savedApp)
                .status(ApplicationStatus.APPLIED)
                .remarks("Job application submitted successfully by candidate.")
                .changedByUser(currentUser)
                .build();

        statusHistoryRepository.save(history);

        return mapToResponseDTO(savedApp);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponseDTO> getMyApplications(int page, int size) {
        Long currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new AccessDeniedException("Authentication required.");
        }

        Student student = studentRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for logged in user."));

        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        return applicationRepository.findByStudent(student, pageable).map(this::mapToResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponseDTO getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        // Ownership Check: Candidate or Recruiter of the job or Admin
        Long currentUserId = securityUtils.getCurrentUserId();
        boolean isCandidate = app.getStudent().getUser().getId().equals(currentUserId);
        boolean isRecruiter = app.getJob().getRecruiter().getUser().getId().equals(currentUserId);
        boolean isAdmin = securityUtils.isAdmin();

        if (!isCandidate && !isRecruiter && !isAdmin) {
            throw new AccessDeniedException("You are not authorized to view this application.");
        }

        return mapToResponseDTO(app);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponseDTO> getApplicantsForJob(Long jobId, ApplicationStatus status, int page, int size) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + jobId));

        // Recruiter Ownership Check: Recruiter can view applicants only for their own jobs
        securityUtils.validateUserOwnershipOrAdmin(job.getRecruiter().getUser().getId());

        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());

        if (status != null) {
            return applicationRepository.findByJobAndStatus(job, status, pageable).map(this::mapToResponseDTO);
        } else {
            return applicationRepository.findByJob(job, pageable).map(this::mapToResponseDTO);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResponseDTO getCandidateProfileForApplication(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Recruiter Ownership Check
        securityUtils.validateUserOwnershipOrAdmin(app.getJob().getRecruiter().getUser().getId());

        Student student = app.getStudent();
        StudentResponseDTO studentDTO = studentService.mapToResponseDTO(student);

        List<StudentSkillResponseDTO> skillDTOs = studentSkillService.getStudentSkills(student.getId());
        List<EducationResponseDTO> eduDTOs = (student.getEducationList() != null) ?
                student.getEducationList().stream().map(e -> EducationResponseDTO.builder()
                        .id(e.getId())
                        .degree(e.getDegree())
                        .institution(e.getInstitution())
                        .fieldOfStudy(e.getFieldOfStudy())
                        .startYear(e.getStartYear())
                        .endYear(e.getEndYear())
                        .percentageOrCgpa(e.getPercentageOrCgpa())
                        .createdAt(e.getCreatedAt())
                        .build()).collect(Collectors.toList()) : List.of();

        EligibilityResponseDTO eligibility = intelligenceService.checkEligibility(student.getId(), app.getJob().getId());
        SkillGapAnalysisResponseDTO skillGap = intelligenceService.performSkillGapAnalysis(student.getId(), app.getJob().getId());

        return CandidateProfileResponseDTO.builder()
                .student(studentDTO)
                .education(eduDTOs)
                .skills(skillDTOs)
                .eligibility(eligibility)
                .skillGap(skillGap)
                .build();
    }

    @Override
    public ApplicationResponseDTO updateApplicationStatus(Long applicationId, ApplicationStatusUpdateDTO statusUpdateDTO) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Recruiter Ownership Check
        securityUtils.validateUserOwnershipOrAdmin(app.getJob().getRecruiter().getUser().getId());

        app.setStatus(statusUpdateDTO.getStatus());
        Application updatedApp = applicationRepository.save(app);

        // Record Status History Audit Log
        Long currentUserId = securityUtils.getCurrentUserId();
        User currentUser = currentUserId != null ? userRepository.findById(currentUserId).orElse(null) : null;

        String remarksText = statusUpdateDTO.getRemarks() != null && !statusUpdateDTO.getRemarks().isBlank() ?
                statusUpdateDTO.getRemarks() : "Application status updated to " + statusUpdateDTO.getStatus();

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(updatedApp)
                .status(statusUpdateDTO.getStatus())
                .remarks(remarksText)
                .changedByUser(currentUser)
                .build();

        statusHistoryRepository.save(history);

        return mapToResponseDTO(updatedApp);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationStatusHistoryResponseDTO> getApplicationStatusHistory(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Access check: Candidate, Recruiter of job, or Admin
        Long currentUserId = securityUtils.getCurrentUserId();
        boolean isCandidate = app.getStudent().getUser().getId().equals(currentUserId);
        boolean isRecruiter = app.getJob().getRecruiter().getUser().getId().equals(currentUserId);
        boolean isAdmin = securityUtils.isAdmin();

        if (!isCandidate && !isRecruiter && !isAdmin) {
            throw new AccessDeniedException("Unauthorized to view application status history.");
        }

        return statusHistoryRepository.findByApplicationOrderByChangedAtAsc(app).stream()
                .map(h -> ApplicationStatusHistoryResponseDTO.builder()
                        .id(h.getId())
                        .status(h.getStatus())
                        .remarks(h.getRemarks())
                        .changedBy(h.getChangedByUser() != null ? h.getChangedByUser().getEmail() : "SYSTEM")
                        .changedAt(h.getChangedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponseDTO> getAllApplications(ApplicationStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        if (status != null) {
            return applicationRepository.findByStatus(status, pageable).map(this::mapToResponseDTO);
        } else {
            return applicationRepository.findAll(pageable).map(this::mapToResponseDTO);
        }
    }

    public ApplicationResponseDTO mapToResponseDTO(Application app) {
        StudentResponseDTO studentDTO = studentService.mapToResponseDTO(app.getStudent());
        JobResponseDTO jobDTO = jobService.mapToResponseDTO(app.getJob());

        return ApplicationResponseDTO.builder()
                .id(app.getId())
                .student(studentDTO)
                .job(jobDTO)
                .status(app.getStatus())
                .skillMatchPercentage(app.getSkillMatchPercentage())
                .appliedAt(app.getAppliedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
