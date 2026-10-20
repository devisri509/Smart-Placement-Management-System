package com.placement.system.controller;

import com.placement.system.dto.ApiResponse;
import com.placement.system.dto.request.EducationRequestDTO;
import com.placement.system.dto.response.EducationResponseDTO;
import com.placement.system.service.EducationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/education")
public class EducationController {

    private final EducationService educationService;

    public EducationController(EducationService educationService) {
        this.educationService = educationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EducationResponseDTO>> addEducation(@Valid @RequestBody EducationRequestDTO requestDTO) {
        EducationResponseDTO education = educationService.addEducation(requestDTO);
        return new ResponseEntity<>(ApiResponse.success("Education record added successfully", education), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EducationResponseDTO>> getEducationById(@PathVariable Long id) {
        EducationResponseDTO education = educationService.getEducationById(id);
        return ResponseEntity.ok(ApiResponse.success("Education record retrieved successfully", education));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<EducationResponseDTO>>> getEducationByStudentId(@PathVariable Long studentId) {
        List<EducationResponseDTO> educationList = educationService.getEducationByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student education history retrieved successfully", educationList));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(@PathVariable Long id) {
        educationService.deleteEducation(id);
        return ResponseEntity.ok(ApiResponse.success("Education record deleted successfully", null));
    }
}
