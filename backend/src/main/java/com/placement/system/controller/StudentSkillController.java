package com.placement.system.controller;

import com.placement.system.dto.ApiResponse;
import com.placement.system.dto.request.StudentSkillRequestDTO;
import com.placement.system.dto.response.StudentSkillResponseDTO;
import com.placement.system.service.StudentSkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentSkillController {

    private final StudentSkillService studentSkillService;

    public StudentSkillController(StudentSkillService studentSkillService) {
        this.studentSkillService = studentSkillService;
    }

    @PostMapping("/{studentId}/skills")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<StudentSkillResponseDTO>> addSkillToStudent(
            @PathVariable Long studentId,
            @Valid @RequestBody StudentSkillRequestDTO requestDTO) {
        StudentSkillResponseDTO skill = studentSkillService.addSkillToStudent(studentId, requestDTO);
        return new ResponseEntity<>(ApiResponse.success("Skill added to student profile successfully", skill), HttpStatus.CREATED);
    }

    @GetMapping("/{studentId}/skills")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<StudentSkillResponseDTO>>> getStudentSkills(@PathVariable Long studentId) {
        List<StudentSkillResponseDTO> skills = studentSkillService.getStudentSkills(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student skills retrieved successfully", skills));
    }

    @DeleteMapping("/{studentId}/skills/{skillId}")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> removeSkillFromStudent(
            @PathVariable Long studentId,
            @PathVariable Long skillId) {
        studentSkillService.removeSkillFromStudent(studentId, skillId);
        return ResponseEntity.ok(ApiResponse.success("Skill removed from student profile successfully", null));
    }
}
