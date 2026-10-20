package com.placement.system.service;

import com.placement.system.dto.request.RecommendationWeightConfigDTO;
import com.placement.system.dto.response.EligibilityResponseDTO;
import com.placement.system.dto.response.JobRecommendationResponseDTO;
import com.placement.system.dto.response.SkillGapAnalysisResponseDTO;
import com.placement.system.dto.response.SkillMatchResponseDTO;
import org.springframework.data.domain.Page;

public interface PlacementIntelligenceService {
    EligibilityResponseDTO checkEligibility(Long studentId, Long jobId);
    SkillMatchResponseDTO calculateSkillMatch(Long studentId, Long jobId);
    SkillGapAnalysisResponseDTO performSkillGapAnalysis(Long studentId, Long jobId);
    double calculateOverallRecommendationScore(Long studentId, Long jobId, RecommendationWeightConfigDTO weights);
    Page<JobRecommendationResponseDTO> recommendJobsForStudent(Long studentId, RecommendationWeightConfigDTO weights, int page, int size);
}
