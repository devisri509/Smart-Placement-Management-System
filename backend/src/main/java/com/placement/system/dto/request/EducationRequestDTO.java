package com.placement.system.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationRequestDTO {

    private Long studentId;

    @NotBlank(message = "Degree is required")
    private String degree;

    @NotBlank(message = "Institution name is required")
    private String institution;

    @NotBlank(message = "Field of study is required")
    private String fieldOfStudy;

    @NotNull(message = "Start year is required")
    @Min(value = 1990, message = "Valid start year required")
    private Integer startYear;

    @NotNull(message = "End year is required")
    @Min(value = 1990, message = "Valid end year required")
    private Integer endYear;

    @NotNull(message = "Percentage or CGPA is required")
    @DecimalMin(value = "0.0", message = "Percentage/CGPA cannot be negative")
    private Double percentageOrCgpa;
}
