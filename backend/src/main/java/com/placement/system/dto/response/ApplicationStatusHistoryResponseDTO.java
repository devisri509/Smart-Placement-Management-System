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
public class ApplicationStatusHistoryResponseDTO {
    private Long id;
    private ApplicationStatus status;
    private String remarks;
    private String changedBy;
    private LocalDateTime changedAt;
}
