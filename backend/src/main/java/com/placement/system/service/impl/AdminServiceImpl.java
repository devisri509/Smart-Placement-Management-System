package com.placement.system.service.impl;

import com.placement.system.dto.request.AdminRequestDTO;
import com.placement.system.dto.response.AdminResponseDTO;
import com.placement.system.dto.response.UserResponseDTO;
import com.placement.system.entity.Admin;
import com.placement.system.entity.User;
import com.placement.system.exception.DuplicateResourceException;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.repository.AdminRepository;
import com.placement.system.repository.UserRepository;
import com.placement.system.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    public AdminServiceImpl(AdminRepository adminRepository, UserRepository userRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AdminResponseDTO createAdmin(AdminRequestDTO requestDTO) {
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));

        if (adminRepository.findByUserId(requestDTO.getUserId()).isPresent()) {
            throw new DuplicateResourceException("Admin profile already exists for user id: " + requestDTO.getUserId());
        }

        Admin admin = Admin.builder()
                .user(user)
                .fullName(requestDTO.getFullName())
                .department(requestDTO.getDepartment() != null ? requestDTO.getDepartment() : "Placement Cell")
                .designation(requestDTO.getDesignation() != null ? requestDTO.getDesignation() : "Placement Officer")
                .build();

        Admin savedAdmin = adminRepository.save(admin);
        return mapToResponseDTO(savedAdmin);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminResponseDTO getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));
        return mapToResponseDTO(admin);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminResponseDTO getAdminByUserId(Long userId) {
        Admin admin = adminRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin profile not found for user id: " + userId));
        return mapToResponseDTO(admin);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminResponseDTO> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete. Admin not found with id: " + id);
        }
        adminRepository.deleteById(id);
    }

    public AdminResponseDTO mapToResponseDTO(Admin admin) {
        UserResponseDTO userDTO = UserResponseDTO.builder()
                .id(admin.getUser().getId())
                .email(admin.getUser().getEmail())
                .role(admin.getUser().getRole())
                .enabled(admin.getUser().isEnabled())
                .createdAt(admin.getUser().getCreatedAt())
                .updatedAt(admin.getUser().getUpdatedAt())
                .build();

        return AdminResponseDTO.builder()
                .id(admin.getId())
                .user(userDTO)
                .fullName(admin.getFullName())
                .department(admin.getDepartment())
                .designation(admin.getDesignation())
                .createdAt(admin.getCreatedAt())
                .updatedAt(admin.getUpdatedAt())
                .build();
    }
}
