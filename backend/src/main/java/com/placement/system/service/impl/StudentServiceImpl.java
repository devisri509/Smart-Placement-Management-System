package com.placement.system.service.impl;

import com.placement.system.dto.request.StudentRequestDTO;
import com.placement.system.dto.response.EducationResponseDTO;
import com.placement.system.dto.response.StudentResponseDTO;
import com.placement.system.dto.response.UserResponseDTO;
import com.placement.system.entity.Student;
import com.placement.system.entity.User;
import com.placement.system.exception.DuplicateResourceException;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.repository.StudentRepository;
import com.placement.system.repository.UserRepository;
import com.placement.system.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final com.placement.system.security.SecurityUtils securityUtils;

    public StudentServiceImpl(StudentRepository studentRepository, UserRepository userRepository, com.placement.system.security.SecurityUtils securityUtils) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.securityUtils = securityUtils;
    }

    @Override
    public StudentResponseDTO createStudent(StudentRequestDTO requestDTO) {
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));

        if (studentRepository.findByUserId(requestDTO.getUserId()).isPresent()) {
            throw new DuplicateResourceException("Student profile already exists for user id: " + requestDTO.getUserId());
        }

        if (studentRepository.existsByRollNumber(requestDTO.getRollNumber())) {
            throw new DuplicateResourceException("Student profile already exists with roll number: " + requestDTO.getRollNumber());
        }

        Student student = Student.builder()
                .user(user)
                .fullName(requestDTO.getFullName())
                .phone(requestDTO.getPhone())
                .rollNumber(requestDTO.getRollNumber())
                .branch(requestDTO.getBranch())
                .cgpa(requestDTO.getCgpa())
                .graduationYear(requestDTO.getGraduationYear())
                .activeBacklogs(requestDTO.getActiveBacklogs() != null ? requestDTO.getActiveBacklogs() : 0)
                .resumeUrl(requestDTO.getResumeUrl())
                .build();

        Student savedStudent = studentRepository.save(student);
        return mapToResponseDTO(savedStudent);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToResponseDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDTO getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));
        return mapToResponseDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDTO getCurrentStudentProfile() {
        Long currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new org.springframework.security.access.AccessDeniedException("Authentication required.");
        }
        return getStudentByUserId(currentUserId);
    }

    @Override
    public StudentResponseDTO updateCurrentStudentProfile(StudentRequestDTO requestDTO) {
        Long currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new org.springframework.security.access.AccessDeniedException("Authentication required.");
        }
        Student student = studentRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + currentUserId));

        if (requestDTO.getFullName() != null) student.setFullName(requestDTO.getFullName());
        if (requestDTO.getPhone() != null) student.setPhone(requestDTO.getPhone());
        if (requestDTO.getBranch() != null) student.setBranch(requestDTO.getBranch());
        if (requestDTO.getCgpa() != null) student.setCgpa(requestDTO.getCgpa());
        if (requestDTO.getGraduationYear() != null) student.setGraduationYear(requestDTO.getGraduationYear());
        if (requestDTO.getActiveBacklogs() != null) student.setActiveBacklogs(requestDTO.getActiveBacklogs());
        if (requestDTO.getResumeUrl() != null) student.setResumeUrl(requestDTO.getResumeUrl());

        Student updatedStudent = studentRepository.save(student);
        return mapToResponseDTO(updatedStudent);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponseDTO updateStudent(Long id, StudentRequestDTO requestDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        securityUtils.validateUserOwnershipOrAdmin(student.getUser().getId());

        student.setFullName(requestDTO.getFullName());
        student.setPhone(requestDTO.getPhone());
        student.setBranch(requestDTO.getBranch());
        student.setCgpa(requestDTO.getCgpa());
        student.setGraduationYear(requestDTO.getGraduationYear());
        if (requestDTO.getActiveBacklogs() != null) {
            student.setActiveBacklogs(requestDTO.getActiveBacklogs());
        }
        if (requestDTO.getResumeUrl() != null) {
            student.setResumeUrl(requestDTO.getResumeUrl());
        }

        Student updatedStudent = studentRepository.save(student);
        return mapToResponseDTO(updatedStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete. Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    public StudentResponseDTO mapToResponseDTO(Student student) {
        UserResponseDTO userDTO = UserResponseDTO.builder()
                .id(student.getUser().getId())
                .email(student.getUser().getEmail())
                .role(student.getUser().getRole())
                .enabled(student.getUser().isEnabled())
                .createdAt(student.getUser().getCreatedAt())
                .updatedAt(student.getUser().getUpdatedAt())
                .build();

        List<EducationResponseDTO> educationDTOs = student.getEducationList() != null ?
                student.getEducationList().stream().map(edu -> EducationResponseDTO.builder()
                        .id(edu.getId())
                        .studentId(student.getId())
                        .degree(edu.getDegree())
                        .institution(edu.getInstitution())
                        .fieldOfStudy(edu.getFieldOfStudy())
                        .startYear(edu.getStartYear())
                        .endYear(edu.getEndYear())
                        .percentageOrCgpa(edu.getPercentageOrCgpa())
                        .createdAt(edu.getCreatedAt())
                        .build()).collect(Collectors.toList()) : List.of();

        return StudentResponseDTO.builder()
                .id(student.getId())
                .user(userDTO)
                .fullName(student.getFullName())
                .phone(student.getPhone())
                .rollNumber(student.getRollNumber())
                .branch(student.getBranch())
                .cgpa(student.getCgpa())
                .graduationYear(student.getGraduationYear())
                .activeBacklogs(student.getActiveBacklogs())
                .resumeUrl(student.getResumeUrl())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .educationList(educationDTOs)
                .build();
    }
}
