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
public class CandidateProfileResponseDTO {
    private StudentResponseDTO student;
    private List<EducationResponseDTO> education;
    private List<StudentSkillResponseDTO> skills;
    private EligibilityResponseDTO eligibility;
    private SkillGapAnalysisResponseDTO skillGap;
}
