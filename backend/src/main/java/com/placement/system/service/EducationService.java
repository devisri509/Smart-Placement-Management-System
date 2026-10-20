package com.placement.system.service;

import com.placement.system.dto.request.EducationRequestDTO;
import com.placement.system.dto.response.EducationResponseDTO;

import java.util.List;

public interface EducationService {
    EducationResponseDTO addEducation(EducationRequestDTO requestDTO);
    EducationResponseDTO getEducationById(Long id);
    List<EducationResponseDTO> getEducationByStudentId(Long studentId);
    void deleteEducation(Long id);
}
