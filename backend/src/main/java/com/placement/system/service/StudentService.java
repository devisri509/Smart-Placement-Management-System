package com.placement.system.service;

import com.placement.system.dto.request.StudentRequestDTO;
import com.placement.system.dto.response.StudentResponseDTO;

import java.util.List;

public interface StudentService {
    StudentResponseDTO createStudent(StudentRequestDTO requestDTO);
    StudentResponseDTO getStudentById(Long id);
    StudentResponseDTO getStudentByUserId(Long userId);
    StudentResponseDTO getCurrentStudentProfile();
    StudentResponseDTO updateCurrentStudentProfile(StudentRequestDTO requestDTO);
    List<StudentResponseDTO> getAllStudents();
    StudentResponseDTO updateStudent(Long id, StudentRequestDTO requestDTO);
    void deleteStudent(Long id);
}
