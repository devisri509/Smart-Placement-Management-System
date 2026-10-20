package com.placement.system.dto.response;

import com.placement.system.entity.enums.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponseDTO {
    private Long id;
    private RecruiterResponseDTO recruiter;
    private String title;
    private String description;
    private String location;
    private JobType jobType;
    private Double packageOrStipend;
    private Double minCgpa;
    private String allowedBranches;
    private Integer minGraduationYear;
    private Integer maxBacklogsAllowed;
    private Integer openings;
    private boolean active;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<JobSkillResponseDTO> requiredSkills;
}
