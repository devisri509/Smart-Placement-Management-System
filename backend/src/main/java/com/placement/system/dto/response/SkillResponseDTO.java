package com.placement.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillResponseDTO {
    private Long id;
    private SkillCategoryResponseDTO category;
    private String name;
    private String description;
    private LocalDateTime createdAt;
}
