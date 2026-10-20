package com.placement.system.dto.response;

import com.placement.system.entity.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponseDTO {
    private Long id;
    private StudentResponseDTO student;
    private JobResponseDTO job;
    private ApplicationStatus status;
    private Double skillMatchPercentage;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
