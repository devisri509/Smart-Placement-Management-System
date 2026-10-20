package com.placement.system.service;

import com.placement.system.dto.request.StudentSkillRequestDTO;
import com.placement.system.dto.response.StudentSkillResponseDTO;

import java.util.List;

public interface StudentSkillService {
    StudentSkillResponseDTO addSkillToStudent(Long studentId, StudentSkillRequestDTO requestDTO);
    List<StudentSkillResponseDTO> getStudentSkills(Long studentId);
    void removeSkillFromStudent(Long studentId, Long skillId);
}
