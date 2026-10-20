package com.placement.system.service.impl;

import com.placement.system.dto.request.RecommendationWeightConfigDTO;
import com.placement.system.dto.response.*;
import com.placement.system.entity.*;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.repository.JobRepository;
import com.placement.system.repository.StudentRepository;
import com.placement.system.service.PlacementIntelligenceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PlacementIntelligenceServiceImpl implements PlacementIntelligenceService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final JobServiceImpl jobService;

    public PlacementIntelligenceServiceImpl(StudentRepository studentRepository,
                                             JobRepository jobRepository,
                                             JobServiceImpl jobService) {
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.jobService = jobService;
    }

    @Override
    public EligibilityResponseDTO checkEligibility(Long studentId, Long jobId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + studentId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + jobId));

        List<String> passedCriteria = new ArrayList<>();
        List<String> failedCriteria = new ArrayList<>();
        List<String> reasons = new ArrayList<>();

        // 1. CGPA Criterion
        if (student.getCgpa() >= job.getMinCgpa()) {
            passedCriteria.add("CGPA Requirement satisfied (" + student.getCgpa() + " >= " + job.getMinCgpa() + ")");
            reasons.add("CGPA requirement satisfied");
        } else {
            failedCriteria.add("CGPA below minimum requirement (Student: " + student.getCgpa() + ", Minimum Required: " + job.getMinCgpa() + ")");
            reasons.add("CGPA requirement not met");
        }

        // 2. Branch Criterion
        String studentBranch = student.getBranch() != null ? student.getBranch().trim().toUpperCase() : "";
        List<String> allowed = Arrays.stream(job.getAllowedBranches().split(","))
                .map(String::trim)
                .map(String::toUpperCase)
                .collect(Collectors.toList());

        if (allowed.contains(studentBranch)) {
            passedCriteria.add("Branch requirement satisfied (" + studentBranch + " in " + job.getAllowedBranches() + ")");
            reasons.add("Branch requirement satisfied");
        } else {
            failedCriteria.add("Branch " + studentBranch + " is not eligible (Allowed: " + job.getAllowedBranches() + ")");
            reasons.add("Branch requirement not met");
        }

        // 3. Graduation Year Criterion
        if (job.getMinGraduationYear() == null || student.getGraduationYear() >= job.getMinGraduationYear()) {
            passedCriteria.add("Graduation Year requirement satisfied (" + student.getGraduationYear() + ")");
            reasons.add("Graduation year requirement satisfied");
        } else {
            failedCriteria.add("Graduation year " + student.getGraduationYear() + " is ineligible (Minimum: " + job.getMinGraduationYear() + ")");
            reasons.add("Graduation year requirement not met");
        }

        // 4. Backlogs Criterion
        int studentBacklogs = student.getActiveBacklogs() != null ? student.getActiveBacklogs() : 0;
        if (studentBacklogs <= job.getMaxBacklogsAllowed()) {
            passedCriteria.add("Backlog limit satisfied (" + studentBacklogs + " active backlogs <= " + job.getMaxBacklogsAllowed() + " allowed)");
            reasons.add("Backlog limit satisfied");
        } else {
            failedCriteria.add("Exceeds backlog limit (" + studentBacklogs + " active backlogs > " + job.getMaxBacklogsAllowed() + " allowed)");
            reasons.add("Backlog limit exceeded");
        }

        // 5. Mandatory Skill Check
        Set<Long> studentSkillIds = student.getStudentSkills().stream()
                .map(ss -> ss.getSkill().getId())
                .collect(Collectors.toSet());

        List<JobSkill> missingMandatory = job.getJobSkills().stream()
                .filter(JobSkill::isMandatory)
                .filter(js -> !studentSkillIds.contains(js.getSkill().getId()))
                .collect(Collectors.toList());

        if (missingMandatory.isEmpty()) {
            passedCriteria.add("All mandatory skill requirements satisfied");
        } else {
            for (JobSkill js : missingMandatory) {
                failedCriteria.add("Missing required mandatory skill: " + js.getSkill().getName());
                reasons.add("Missing required skill: " + js.getSkill().getName());
            }
        }

        boolean eligible = failedCriteria.isEmpty();

        return EligibilityResponseDTO.builder()
                .eligible(eligible)
                .studentId(studentId)
                .jobId(jobId)
                .reasons(reasons)
                .failedCriteria(failedCriteria)
                .passedCriteria(passedCriteria)
                .build();
    }

    @Override
    public SkillMatchResponseDTO calculateSkillMatch(Long studentId, Long jobId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + studentId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + jobId));

        List<JobSkill> requiredJobSkills = job.getJobSkills() != null ? job.getJobSkills() : List.of();
        int totalRequired = requiredJobSkills.size();

        if (totalRequired == 0) {
            return SkillMatchResponseDTO.builder()
                    .studentId(studentId)
                    .jobId(jobId)
                    .totalRequiredSkills(0)
                    .matchedSkillsCount(0)
                    .missingSkillsCount(0)
                    .matchPercentage(100.0)
                    .matchedSkills(List.of())
                    .missingSkills(List.of())
                    .build();
        }

        Set<Long> studentSkillIds = student.getStudentSkills().stream()
                .map(ss -> ss.getSkill().getId())
                .collect(Collectors.toSet());

        List<SkillResponseDTO> matchedSkills = new ArrayList<>();
        List<SkillResponseDTO> missingSkills = new ArrayList<>();

        for (JobSkill js : requiredJobSkills) {
            Skill s = js.getSkill();
            SkillResponseDTO dto = SkillResponseDTO.builder()
                    .id(s.getId())
                    .name(s.getName())
                    .description(s.getDescription())
                    .createdAt(s.getCreatedAt())
                    .category(SkillCategoryResponseDTO.builder()
                            .id(s.getCategory().getId())
                            .name(s.getCategory().getName())
                            .description(s.getCategory().getDescription())
                            .build())
                    .build();

            if (studentSkillIds.contains(s.getId())) {
                matchedSkills.add(dto);
            } else {
                missingSkills.add(dto);
            }
        }

        double rawPercentage = ((double) matchedSkills.size() / totalRequired) * 100.0;
        double matchPercentage = BigDecimal.valueOf(rawPercentage)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();

        return SkillMatchResponseDTO.builder()
                .studentId(studentId)
                .jobId(jobId)
                .totalRequiredSkills(totalRequired)
                .matchedSkillsCount(matchedSkills.size())
                .missingSkillsCount(missingSkills.size())
                .matchPercentage(matchPercentage)
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .build();
    }

    @Override
    public SkillGapAnalysisResponseDTO performSkillGapAnalysis(Long studentId, Long jobId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + studentId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + jobId));

        SkillMatchResponseDTO matchSummary = calculateSkillMatch(studentId, jobId);

        Map<Long, StudentSkill> studentSkillMap = student.getStudentSkills().stream()
                .collect(Collectors.toMap(ss -> ss.getSkill().getId(), ss -> ss));

        List<JobSkillResponseDTO> matchedDetails = new ArrayList<>();
        List<JobSkillResponseDTO> missingDetails = new ArrayList<>();
        List<String> actionSteps = new ArrayList<>();

        for (JobSkill js : job.getJobSkills()) {
            Skill s = js.getSkill();
            SkillResponseDTO skillDTO = SkillResponseDTO.builder()
                    .id(s.getId())
                    .name(s.getName())
                    .description(s.getDescription())
                    .createdAt(s.getCreatedAt())
                    .category(SkillCategoryResponseDTO.builder()
                            .id(s.getCategory().getId())
                            .name(s.getCategory().getName())
                            .description(s.getCategory().getDescription())
                            .build())
                    .build();

            JobSkillResponseDTO jsDTO = JobSkillResponseDTO.builder()
                    .id(js.getId())
                    .skill(skillDTO)
                    .mandatory(js.isMandatory())
                    .minimumProficiency(js.getMinimumProficiency())
                    .build();

            if (studentSkillMap.containsKey(s.getId())) {
                matchedDetails.add(jsDTO);
                StudentSkill ss = studentSkillMap.get(s.getId());
                if (ss.getProficiency().ordinal() < js.getMinimumProficiency().ordinal()) {
                    actionSteps.add("Upgrade proficiency in " + s.getName() + " from " + ss.getProficiency() + " to " + js.getMinimumProficiency());
                }
            } else {
                missingDetails.add(jsDTO);
                actionSteps.add((js.isMandatory() ? "HIGH PRIORITY: Learn mandatory skill " : "Learn recommended skill ") + s.getName() + " (" + s.getCategory().getName() + ")");
            }
        }

        if (actionSteps.isEmpty()) {
            actionSteps.add("You possess all required skills at or above the minimum required proficiency!");
        }

        return SkillGapAnalysisResponseDTO.builder()
                .studentId(studentId)
                .jobId(jobId)
                .jobTitle(job.getTitle())
                .companyName(job.getRecruiter().getCompanyName())
                .skillMatchPercentage(matchSummary.getMatchPercentage())
                .matchedSkillDetails(matchedDetails)
                .missingSkillDetails(missingDetails)
                .recommendedActionSteps(actionSteps)
                .build();
    }

    @Override
    public double calculateOverallRecommendationScore(Long studentId, Long jobId, RecommendationWeightConfigDTO weights) {
        if (weights == null) {
            weights = new RecommendationWeightConfigDTO();
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + studentId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + jobId));

        // 1. Skill Match Score (0 - 100)
        double skillMatchScore = calculateSkillMatch(studentId, jobId).getMatchPercentage();

        // 2. CGPA Score (0 - 100)
        double cgpaScore = Math.min(100.0, (student.getCgpa() / 10.0) * 100.0);

        // 3. Backlog Score (0 - 100)
        int backlogs = student.getActiveBacklogs() != null ? student.getActiveBacklogs() : 0;
        double backlogScore = backlogs == 0 ? 100.0 : Math.max(0.0, 100.0 - (backlogs * 35.0));

        // 4. Graduation Year / Preference Score (0 - 100)
        double gradYearScore = (job.getMinGraduationYear() == null || student.getGraduationYear() >= job.getMinGraduationYear()) ? 100.0 : 0.0;

        // Weighted Formula
        double weightedScore = (skillMatchScore * weights.getSkillMatchWeight())
                             + (cgpaScore * weights.getCgpaWeight())
                             + (backlogScore * weights.getBacklogWeight())
                             + (gradYearScore * weights.getGraduationYearWeight());

        return BigDecimal.valueOf(weightedScore)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    @Override
    public Page<JobRecommendationResponseDTO> recommendJobsForStudent(Long studentId, RecommendationWeightConfigDTO weights, int page, int size) {
        if (weights == null) {
            weights = new RecommendationWeightConfigDTO();
        }

        final RecommendationWeightConfigDTO finalWeights = weights;
        LocalDateTime now = LocalDateTime.now();

        List<Job> activeJobs = jobRepository.findAll().stream()
                .filter(Job::isActive)
                .filter(j -> j.getDeadline().isAfter(now))
                .collect(Collectors.toList());

        List<JobRecommendationResponseDTO> recommendations = new ArrayList<>();

        for (Job job : activeJobs) {
            EligibilityResponseDTO eligibility = checkEligibility(studentId, job.getId());
            SkillGapAnalysisResponseDTO skillGap = performSkillGapAnalysis(studentId, job.getId());
            double overallScore = calculateOverallRecommendationScore(studentId, job.getId(), finalWeights);
            JobResponseDTO jobDTO = jobService.mapToResponseDTO(job);

            JobRecommendationResponseDTO rec = JobRecommendationResponseDTO.builder()
                    .job(jobDTO)
                    .overallScore(overallScore)
                    .skillMatchPercentage(skillGap.getSkillMatchPercentage())
                    .eligible(eligibility.isEligible())
                    .eligibilityDetails(eligibility)
                    .skillGapDetails(skillGap)
                    .build();

            recommendations.add(rec);
        }

        // Sort by Overall Recommendation Score Descending
        recommendations.sort(Comparator.comparingDouble(JobRecommendationResponseDTO::getOverallScore).reversed());

        Pageable pageable = PageRequest.of(page, size);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), recommendations.size());

        List<JobRecommendationResponseDTO> pageContent = (start <= end && start < recommendations.size()) ?
                recommendations.subList(start, end) : List.of();

        return new PageImpl<>(pageContent, pageable, recommendations.size());
    }
}
