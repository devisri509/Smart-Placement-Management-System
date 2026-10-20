package com.placement.system.service;

import com.placement.system.dto.request.LoginRequest;
import com.placement.system.dto.request.RecruiterRegistrationRequest;
import com.placement.system.dto.request.StudentRegistrationRequest;
import com.placement.system.dto.response.LoginResponse;
import com.placement.system.dto.response.RecruiterResponseDTO;
import com.placement.system.dto.response.StudentResponseDTO;

public interface AuthService {
    StudentResponseDTO registerStudent(StudentRegistrationRequest request);
    RecruiterResponseDTO registerRecruiter(RecruiterRegistrationRequest request);
    LoginResponse login(LoginRequest request);
}
