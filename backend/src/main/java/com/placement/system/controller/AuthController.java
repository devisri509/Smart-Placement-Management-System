package com.placement.system.controller;

import com.placement.system.dto.ApiResponse;
import com.placement.system.dto.request.LoginRequest;
import com.placement.system.dto.request.RecruiterRegistrationRequest;
import com.placement.system.dto.request.StudentRegistrationRequest;
import com.placement.system.dto.response.LoginResponse;
import com.placement.system.dto.response.RecruiterResponseDTO;
import com.placement.system.dto.response.StudentResponseDTO;
import com.placement.system.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/student")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> registerStudent(@Valid @RequestBody StudentRegistrationRequest request) {
        StudentResponseDTO student = authService.registerStudent(request);
        return new ResponseEntity<>(ApiResponse.success("Student registered successfully", student), HttpStatus.CREATED);
    }

    @PostMapping("/register/recruiter")
    public ResponseEntity<ApiResponse<RecruiterResponseDTO>> registerRecruiter(@Valid @RequestBody RecruiterRegistrationRequest request) {
        RecruiterResponseDTO recruiter = authService.registerRecruiter(request);
        return new ResponseEntity<>(ApiResponse.success("Recruiter registered successfully. Pending admin approval.", recruiter), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully. Please clear client-side token.", null));
    }
}
