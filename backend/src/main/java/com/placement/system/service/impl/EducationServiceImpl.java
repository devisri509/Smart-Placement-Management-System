package com.placement.system.service.impl;

import com.placement.system.dto.request.EducationRequestDTO;
import com.placement.system.dto.response.EducationResponseDTO;
import com.placement.system.entity.Education;
import com.placement.system.entity.Student;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.repository.EducationRepository;
import com.placement.system.repository.StudentRepository;
import com.placement.system.service.EducationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EducationServiceImpl implements EducationService {

    private final EducationRepository educationRepository;
    private final StudentRepository studentRepository;
    private final com.placement.system.security.SecurityUtils securityUtils;

    public EducationServiceImpl(EducationRepository educationRepository,
                                StudentRepository studentRepository,
                                com.placement.system.security.SecurityUtils securityUtils) {
        this.educationRepository = educationRepository;
        this.studentRepository = studentRepository;
        this.securityUtils = securityUtils;
    }

    @Override
    public EducationResponseDTO addEducation(EducationRequestDTO requestDTO) {
        Long studentId = requestDTO.getStudentId();
        if (studentId == null) {
            Long currentUserId = securityUtils.getCurrentUserId();
            if (currentUserId != null) {
                Student s = studentRepository.findByUserId(currentUserId).orElse(null);
                if (s != null) studentId = s.getId();
            }
        }
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID is required.");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + requestDTO.getStudentId()));

        Education education = Education.builder()
                .student(student)
                .degree(requestDTO.getDegree())
                .institution(requestDTO.getInstitution())
                .fieldOfStudy(requestDTO.getFieldOfStudy())
                .startYear(requestDTO.getStartYear())
                .endYear(requestDTO.getEndYear())
                .percentageOrCgpa(requestDTO.getPercentageOrCgpa())
                .build();

        Education savedEducation = educationRepository.save(education);
        return mapToResponseDTO(savedEducation);
    }

    @Override
    @Transactional(readOnly = true)
    public EducationResponseDTO getEducationById(Long id) {
        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education record not found with id: " + id));
        return mapToResponseDTO(education);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EducationResponseDTO> getEducationByStudentId(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        return educationRepository.findByStudentId(studentId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteEducation(Long id) {
        if (!educationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete. Education record not found with id: " + id);
        }
        educationRepository.deleteById(id);
    }

    public EducationResponseDTO mapToResponseDTO(Education education) {
        return EducationResponseDTO.builder()
                .id(education.getId())
                .studentId(education.getStudent().getId())
                .degree(education.getDegree())
                .institution(education.getInstitution())
                .fieldOfStudy(education.getFieldOfStudy())
                .startYear(education.getStartYear())
                .endYear(education.getEndYear())
                .percentageOrCgpa(education.getPercentageOrCgpa())
                .createdAt(education.getCreatedAt())
                .build();
    }
}
