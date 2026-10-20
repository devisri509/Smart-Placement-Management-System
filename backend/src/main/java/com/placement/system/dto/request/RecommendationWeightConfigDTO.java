package com.placement.system.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationWeightConfigDTO {

    @Builder.Default
    @DecimalMin("0.0") @DecimalMax("1.0")
    private double skillMatchWeight = 0.60;

    @Builder.Default
    @DecimalMin("0.0") @DecimalMax("1.0")
    private double cgpaWeight = 0.20;

    @Builder.Default
    @DecimalMin("0.0") @DecimalMax("1.0")
    private double backlogWeight = 0.10;

    @Builder.Default
    @DecimalMin("0.0") @DecimalMax("1.0")
    private double graduationYearWeight = 0.10;
}
