package com.placement.system.dto.response;

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
public class StudentResponseDTO {
    private Long id;
    private UserResponseDTO user;
    private String fullName;
    private String phone;
    private String rollNumber;
    private String branch;
    private Double cgpa;
    private Integer graduationYear;
    private Integer activeBacklogs;
    private String resumeUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<EducationResponseDTO> educationList;
}
