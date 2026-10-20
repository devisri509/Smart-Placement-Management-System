package com.placement.system.controller;

import com.placement.system.dto.ApiResponse;
import com.placement.system.dto.request.RecruiterRequestDTO;
import com.placement.system.dto.response.RecruiterResponseDTO;
import com.placement.system.service.RecruiterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recruiters")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RecruiterResponseDTO>> createRecruiter(@Valid @RequestBody RecruiterRequestDTO requestDTO) {
        RecruiterResponseDTO recruiter = recruiterService.createRecruiter(requestDTO);
        return new ResponseEntity<>(ApiResponse.success("Recruiter profile created successfully", recruiter), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RecruiterResponseDTO>> getRecruiterById(@PathVariable Long id) {
        RecruiterResponseDTO recruiter = recruiterService.getRecruiterById(id);
        return ResponseEntity.ok(ApiResponse.success("Recruiter profile retrieved successfully", recruiter));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<RecruiterResponseDTO>> getRecruiterByUserId(@PathVariable Long userId) {
        RecruiterResponseDTO recruiter = recruiterService.getRecruiterByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Recruiter profile retrieved successfully", recruiter));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<RecruiterResponseDTO>> getCurrentRecruiterProfile() {
        RecruiterResponseDTO recruiter = recruiterService.getCurrentRecruiterProfile();
        return ResponseEntity.ok(ApiResponse.success("Recruiter profile retrieved successfully", recruiter));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<RecruiterResponseDTO>> updateCurrentRecruiterProfile(@RequestBody RecruiterRequestDTO requestDTO) {
        RecruiterResponseDTO recruiter = recruiterService.updateCurrentRecruiterProfile(requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Recruiter profile updated successfully", recruiter));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RecruiterResponseDTO>>> getAllRecruiters() {
        List<RecruiterResponseDTO> recruiters = recruiterService.getAllRecruiters();
        return ResponseEntity.ok(ApiResponse.success("All recruiter profiles retrieved successfully", recruiters));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RecruiterResponseDTO>> updateRecruiter(@PathVariable Long id, @Valid @RequestBody RecruiterRequestDTO requestDTO) {
        RecruiterResponseDTO recruiter = recruiterService.updateRecruiter(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Recruiter profile updated successfully", recruiter));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<RecruiterResponseDTO>> approveRecruiter(@PathVariable Long id) {
        RecruiterResponseDTO recruiter = recruiterService.approveRecruiter(id);
        return ResponseEntity.ok(ApiResponse.success("Recruiter company approved successfully", recruiter));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRecruiter(@PathVariable Long id) {
        recruiterService.deleteRecruiter(id);
        return ResponseEntity.ok(ApiResponse.success("Recruiter profile deleted successfully", null));
    }
}
