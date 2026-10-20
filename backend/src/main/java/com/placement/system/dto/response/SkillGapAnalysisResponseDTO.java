package com.placement.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapAnalysisResponseDTO {
    private Long studentId;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private double skillMatchPercentage;
    private List<JobSkillResponseDTO> matchedSkillDetails;
    private List<JobSkillResponseDTO> missingSkillDetails;
    private List<String> recommendedActionSteps;
}
