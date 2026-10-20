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
public class RecruiterResponseDTO {
    private Long id;
    private UserResponseDTO user;
    private String companyName;
    private String companyLogoUrl;
    private String website;
    private String description;
    private String location;
    private boolean approved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
