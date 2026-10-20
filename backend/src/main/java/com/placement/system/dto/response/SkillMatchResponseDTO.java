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
public class SkillMatchResponseDTO {
    private Long studentId;
    private Long jobId;
    private int totalRequiredSkills;
    private int matchedSkillsCount;
    private int missingSkillsCount;
    private double matchPercentage;
    private List<SkillResponseDTO> matchedSkills;
    private List<SkillResponseDTO> missingSkills;
}
