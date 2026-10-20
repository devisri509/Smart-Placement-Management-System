package com.placement.system.dto.response;

import com.placement.system.entity.enums.ProficiencyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentSkillResponseDTO {
    private Long id;
    private SkillResponseDTO skill;
    private ProficiencyLevel proficiency;
}
