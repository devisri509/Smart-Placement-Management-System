package com.placement.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityResponseDTO {
    private boolean eligible;
    private Long studentId;
    private Long jobId;
    private List<String> reasons;
    private List<String> failedCriteria;
    private List<String> passedCriteria;
}
