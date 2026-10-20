package com.placement.system.controller;

import com.placement.system.dto.ApiResponse;
import com.placement.system.dto.request.RecommendationWeightConfigDTO;
import com.placement.system.dto.response.*;
import com.placement.system.entity.Student;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.repository.StudentRepository;
import com.placement.system.security.SecurityUtils;
import com.placement.system.service.PlacementIntelligenceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/intelligence")
public class PlacementIntelligenceController {

    private final PlacementIntelligenceService intelligenceService;
    private final SecurityUtils securityUtils;
    private final StudentRepository studentRepository;

    public PlacementIntelligenceController(PlacementIntelligenceService intelligenceService,
                                         SecurityUtils securityUtils,
                                         StudentRepository studentRepository) {
        this.intelligenceService = intelligenceService;
        this.securityUtils = securityUtils;
        this.studentRepository = studentRepository;
    }

    private Long resolveStudentId(Long studentId) {
        if (studentId != null) {
            return studentId;
        }
        Long currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new ResourceNotFoundException("Authenticated user context missing.");
        }
        Student student = studentRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for logged in user."));
        return student.getId();
    }

    @GetMapping("/eligibility")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EligibilityResponseDTO>> checkEligibility(
            @RequestParam(required = false) Long studentId,
            @RequestParam Long jobId) {
        Long resolvedId = resolveStudentId(studentId);
        EligibilityResponseDTO response = intelligenceService.checkEligibility(resolvedId, jobId);
        return ResponseEntity.ok(ApiResponse.success("Eligibility evaluation completed successfully", response));
    }

    @GetMapping("/skill-match")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SkillMatchResponseDTO>> calculateSkillMatch(
            @RequestParam(required = false) Long studentId,
            @RequestParam Long jobId) {
        Long resolvedId = resolveStudentId(studentId);
        SkillMatchResponseDTO response = intelligenceService.calculateSkillMatch(resolvedId, jobId);
        return ResponseEntity.ok(ApiResponse.success("Skill matching evaluation completed successfully", response));
    }

    @GetMapping("/skill-gap")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SkillGapAnalysisResponseDTO>> performSkillGapAnalysis(
            @RequestParam(required = false) Long studentId,
            @RequestParam Long jobId) {
        Long resolvedId = resolveStudentId(studentId);
        SkillGapAnalysisResponseDTO response = intelligenceService.performSkillGapAnalysis(resolvedId, jobId);
        return ResponseEntity.ok(ApiResponse.success("Skill gap analysis completed successfully", response));
    }

    @PostMapping("/recommendations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<JobRecommendationResponseDTO>>> getJobRecommendations(
            @RequestParam(required = false) Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @Valid @RequestBody(required = false) RecommendationWeightConfigDTO weights) {
        Long resolvedId = resolveStudentId(studentId);
        if (weights == null) {
            weights = new RecommendationWeightConfigDTO();
        }
        Page<JobRecommendationResponseDTO> recommendations = intelligenceService.recommendJobsForStudent(resolvedId, weights, page, size);
        return ResponseEntity.ok(ApiResponse.success("Intelligent job recommendations generated successfully", recommendations));
    }
}
