package com.placement.system.dto.request;

import com.placement.system.entity.enums.ProficiencyLevel;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSkillRequestDTO {

    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @Builder.Default
    private boolean mandatory = true;

    @Builder.Default
    private ProficiencyLevel minimumProficiency = ProficiencyLevel.BEGINNER;
}
