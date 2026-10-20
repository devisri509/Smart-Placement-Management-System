package com.placement.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRecommendationResponseDTO {
    private JobResponseDTO job;
    private double overallScore;
    private double skillMatchPercentage;
    private boolean eligible;
    private EligibilityResponseDTO eligibilityDetails;
    private SkillGapAnalysisResponseDTO skillGapDetails;
}
