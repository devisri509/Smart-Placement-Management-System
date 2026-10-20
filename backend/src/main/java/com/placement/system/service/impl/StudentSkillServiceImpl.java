package com.placement.system.service.impl;

import com.placement.system.dto.request.StudentSkillRequestDTO;
import com.placement.system.dto.response.SkillCategoryResponseDTO;
import com.placement.system.dto.response.SkillResponseDTO;
import com.placement.system.dto.response.StudentSkillResponseDTO;
import com.placement.system.entity.Skill;
import com.placement.system.entity.Student;
import com.placement.system.entity.StudentSkill;
import com.placement.system.exception.DuplicateResourceException;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.repository.SkillRepository;
import com.placement.system.repository.StudentRepository;
import com.placement.system.repository.StudentSkillRepository;
import com.placement.system.security.SecurityUtils;
import com.placement.system.service.StudentSkillService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentSkillServiceImpl implements StudentSkillService {

    private final StudentSkillRepository studentSkillRepository;
    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;
    private final SecurityUtils securityUtils;

    public StudentSkillServiceImpl(StudentSkillRepository studentSkillRepository,
                                   StudentRepository studentRepository,
                                   SkillRepository skillRepository,
                                   SecurityUtils securityUtils) {
        this.studentSkillRepository = studentSkillRepository;
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
        this.securityUtils = securityUtils;
    }

    @Override
    public StudentSkillResponseDTO addSkillToStudent(Long studentId, StudentSkillRequestDTO requestDTO) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        securityUtils.validateUserOwnershipOrAdmin(student.getUser().getId());

        if (studentSkillRepository.existsByStudentIdAndSkillId(studentId, requestDTO.getSkillId())) {
            throw new DuplicateResourceException("Student already has this skill mapped to profile.");
        }

        Skill skill = skillRepository.findById(requestDTO.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + requestDTO.getSkillId()));

        StudentSkill studentSkill = StudentSkill.builder()
                .student(student)
                .skill(skill)
                .proficiency(requestDTO.getProficiency())
                .build();

        StudentSkill savedSkill = studentSkillRepository.save(studentSkill);
        return mapToResponseDTO(savedSkill);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentSkillResponseDTO> getStudentSkills(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return studentSkillRepository.findByStudent(student).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void removeSkillFromStudent(Long studentId, Long skillId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        securityUtils.validateUserOwnershipOrAdmin(student.getUser().getId());
        studentSkillRepository.deleteByStudentIdAndSkillId(studentId, skillId);
    }

    public StudentSkillResponseDTO mapToResponseDTO(StudentSkill ss) {
        return StudentSkillResponseDTO.builder()
                .id(ss.getId())
                .skill(SkillResponseDTO.builder()
                        .id(ss.getSkill().getId())
                        .name(ss.getSkill().getName())
                        .description(ss.getSkill().getDescription())
                        .createdAt(ss.getSkill().getCreatedAt())
                        .category(SkillCategoryResponseDTO.builder()
                                .id(ss.getSkill().getCategory().getId())
                                .name(ss.getSkill().getCategory().getName())
                                .description(ss.getSkill().getCategory().getDescription())
                                .build())
                        .build())
                .proficiency(ss.getProficiency())
                .build();
    }
}
