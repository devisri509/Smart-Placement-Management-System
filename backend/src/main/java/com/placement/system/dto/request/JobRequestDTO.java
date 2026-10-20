package com.placement.system.dto.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.placement.system.config.LocalDateTimeFlexibleDeserializer;
import com.placement.system.entity.enums.JobType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRequestDTO {

    @NotBlank(message = "Job title is required")
    @Size(max = 200, message = "Job title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotBlank(message = "Location is required")
    @Size(max = 150, message = "Location cannot exceed 150 characters")
    private String location;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    @PositiveOrZero(message = "Package or stipend must be positive or zero")
    private Double packageOrStipend;

    @DecimalMin(value = "0.0", message = "Minimum CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "Minimum CGPA cannot exceed 10.0")
    private Double minCgpa;

    @NotBlank(message = "Allowed branches are required")
    private String allowedBranches;

    @Min(value = 2020, message = "Valid graduation year required")
    private Integer minGraduationYear;

    @Min(value = 0, message = "Backlogs cannot be negative")
    private Integer maxBacklogsAllowed;

    @Min(value = 1, message = "Number of openings must be at least 1")
    @Builder.Default
    private Integer openings = 1;

    @NotNull(message = "Application deadline is required")
    @Future(message = "Application deadline must be a future date and time")
    @JsonDeserialize(using = LocalDateTimeFlexibleDeserializer.class)
    private LocalDateTime deadline;

    @Valid
    @Builder.Default
    private List<JobSkillRequestDTO> requiredSkills = new ArrayList<>();
}
