package com.placement.system.service.impl;

import com.placement.system.dto.request.LoginRequest;
import com.placement.system.dto.request.RecruiterRegistrationRequest;
import com.placement.system.dto.request.StudentRegistrationRequest;
import com.placement.system.dto.response.LoginResponse;
import com.placement.system.dto.response.RecruiterResponseDTO;
import com.placement.system.dto.response.StudentResponseDTO;
import com.placement.system.entity.Admin;
import com.placement.system.entity.Recruiter;
import com.placement.system.entity.Student;
import com.placement.system.entity.User;
import com.placement.system.entity.enums.RoleType;
import com.placement.system.exception.DuplicateResourceException;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.repository.AdminRepository;
import com.placement.system.repository.RecruiterRepository;
import com.placement.system.repository.StudentRepository;
import com.placement.system.repository.UserRepository;
import com.placement.system.security.JwtTokenProvider;
import com.placement.system.service.AuthService;
import com.placement.system.service.RecruiterService;
import com.placement.system.service.StudentService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final StudentServiceImpl studentService;
    private final RecruiterServiceImpl recruiterService;

    public AuthServiceImpl(UserRepository userRepository,
                           StudentRepository studentRepository,
                           RecruiterRepository recruiterRepository,
                           AdminRepository adminRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider,
                           StudentServiceImpl studentService,
                           RecruiterServiceImpl recruiterService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.recruiterRepository = recruiterRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.studentService = studentService;
        this.recruiterService = recruiterService;
    }

    @Override
    public StudentResponseDTO registerStudent(StudentRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User already exists with email: " + request.getEmail());
        }

        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new DuplicateResourceException("Student profile already exists with roll number: " + request.getRollNumber());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.ROLE_STUDENT)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        Student student = Student.builder()
                .user(savedUser)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .rollNumber(request.getRollNumber())
                .branch(request.getBranch())
                .cgpa(request.getCgpa())
                .graduationYear(request.getGraduationYear())
                .activeBacklogs(request.getActiveBacklogs() != null ? request.getActiveBacklogs() : 0)
                .resumeUrl(request.getResumeUrl())
                .build();

        Student savedStudent = studentRepository.save(student);
        return studentService.mapToResponseDTO(savedStudent);
    }

    @Override
    public RecruiterResponseDTO registerRecruiter(RecruiterRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User already exists with email: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.ROLE_RECRUITER)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        Recruiter recruiter = Recruiter.builder()
                .user(savedUser)
                .companyName(request.getCompanyName())
                .companyLogoUrl(request.getCompanyLogoUrl())
                .website(request.getWebsite())
                .description(request.getDescription())
                .location(request.getLocation())
                .approved(false)
                .build();

        Recruiter savedRecruiter = recruiterRepository.save(recruiter);
        return recruiterService.mapToResponseDTO(savedRecruiter);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        Long profileId = null;
        String fullNameOrCompany = user.getEmail();

        if (user.getRole() == RoleType.ROLE_STUDENT) {
            Optional<Student> studentOpt = studentRepository.findByUserId(user.getId());
            if (studentOpt.isPresent()) {
                profileId = studentOpt.get().getId();
                fullNameOrCompany = studentOpt.get().getFullName();
            }
        } else if (user.getRole() == RoleType.ROLE_RECRUITER) {
            Optional<Recruiter> recruiterOpt = recruiterRepository.findByUserId(user.getId());
            if (recruiterOpt.isPresent()) {
                profileId = recruiterOpt.get().getId();
                fullNameOrCompany = recruiterOpt.get().getCompanyName();
            }
        } else if (user.getRole() == RoleType.ROLE_ADMIN) {
            Optional<Admin> adminOpt = adminRepository.findByUserId(user.getId());
            if (adminOpt.isPresent()) {
                profileId = adminOpt.get().getId();
                fullNameOrCompany = adminOpt.get().getFullName();
            }
        }

        return LoginResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .profileId(profileId)
                .fullNameOrCompany(fullNameOrCompany)
                .build();
    }
}
