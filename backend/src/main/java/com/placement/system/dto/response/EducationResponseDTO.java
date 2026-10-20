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
public class EducationResponseDTO {
    private Long id;
    private Long studentId;
    private String degree;
    private String institution;
    private String fieldOfStudy;
    private Integer startYear;
    private Integer endYear;
    private Double percentageOrCgpa;
    private LocalDateTime createdAt;
}
