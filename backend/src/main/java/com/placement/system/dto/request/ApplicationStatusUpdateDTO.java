package com.placement.system.dto.request;

import com.placement.system.entity.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationStatusUpdateDTO {

    @NotNull(message = "Application status is required")
    private ApplicationStatus status;

    private String remarks;
}
