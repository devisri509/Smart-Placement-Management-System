package com.placement.system.controller;

import com.placement.system.dto.ApiResponse;
import com.placement.system.dto.request.StudentRequestDTO;
import com.placement.system.dto.response.StudentResponseDTO;
import com.placement.system.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponseDTO>> createStudent(@Valid @RequestBody StudentRequestDTO requestDTO) {
        StudentResponseDTO student = studentService.createStudent(requestDTO);
        return new ResponseEntity<>(ApiResponse.success("Student profile created successfully", student), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> getStudentById(@PathVariable Long id) {
        StudentResponseDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student profile retrieved successfully", student));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> getCurrentStudentProfile() {
        StudentResponseDTO student = studentService.getCurrentStudentProfile();
        return ResponseEntity.ok(ApiResponse.success("Student profile retrieved successfully", student));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> updateCurrentStudentProfile(@RequestBody StudentRequestDTO requestDTO) {
        StudentResponseDTO student = studentService.updateCurrentStudentProfile(requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Student profile updated successfully", student));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> getStudentByUserId(@PathVariable Long userId) {
        StudentResponseDTO student = studentService.getStudentByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Student profile retrieved successfully", student));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> getAllStudents() {
        List<StudentResponseDTO> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("All student profiles retrieved successfully", students));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentRequestDTO requestDTO) {
        StudentResponseDTO student = studentService.updateStudent(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Student profile updated successfully", student));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student profile deleted successfully", null));
    }
}
