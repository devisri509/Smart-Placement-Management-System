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
public class AdminResponseDTO {
    private Long id;
    private UserResponseDTO user;
    private String fullName;
    private String department;
    private String designation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
