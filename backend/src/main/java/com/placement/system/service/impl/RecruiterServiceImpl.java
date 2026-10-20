package com.placement.system.service.impl;

import com.placement.system.dto.request.RecruiterRequestDTO;
import com.placement.system.dto.response.RecruiterResponseDTO;
import com.placement.system.dto.response.UserResponseDTO;
import com.placement.system.entity.Recruiter;
import com.placement.system.entity.User;
import com.placement.system.exception.DuplicateResourceException;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.repository.RecruiterRepository;
import com.placement.system.repository.UserRepository;
import com.placement.system.service.RecruiterService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecruiterServiceImpl implements RecruiterService {

    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;
    private final com.placement.system.security.SecurityUtils securityUtils;

    public RecruiterServiceImpl(RecruiterRepository recruiterRepository, UserRepository userRepository, com.placement.system.security.SecurityUtils securityUtils) {
        this.recruiterRepository = recruiterRepository;
        this.userRepository = userRepository;
        this.securityUtils = securityUtils;
    }

    @Override
    public RecruiterResponseDTO createRecruiter(RecruiterRequestDTO requestDTO) {
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));

        if (recruiterRepository.findByUserId(requestDTO.getUserId()).isPresent()) {
            throw new DuplicateResourceException("Recruiter profile already exists for user id: " + requestDTO.getUserId());
        }

        Recruiter recruiter = Recruiter.builder()
                .user(user)
                .companyName(requestDTO.getCompanyName())
                .companyLogoUrl(requestDTO.getCompanyLogoUrl())
                .website(requestDTO.getWebsite())
                .description(requestDTO.getDescription())
                .location(requestDTO.getLocation())
                .approved(false)
                .build();

        Recruiter savedRecruiter = recruiterRepository.save(recruiter);
        return mapToResponseDTO(savedRecruiter);
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterResponseDTO getRecruiterById(Long id) {
        Recruiter recruiter = recruiterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with id: " + id));
        return mapToResponseDTO(recruiter);
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterResponseDTO getRecruiterByUserId(Long userId) {
        Recruiter recruiter = recruiterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for user id: " + userId));
        return mapToResponseDTO(recruiter);
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterResponseDTO getCurrentRecruiterProfile() {
        Long currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new org.springframework.security.access.AccessDeniedException("Authentication required.");
        }
        return getRecruiterByUserId(currentUserId);
    }

    @Override
    public RecruiterResponseDTO updateCurrentRecruiterProfile(RecruiterRequestDTO requestDTO) {
        Long currentUserId = securityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new org.springframework.security.access.AccessDeniedException("Authentication required.");
        }
        Recruiter recruiter = recruiterRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for user id: " + currentUserId));

        if (requestDTO.getCompanyName() != null) recruiter.setCompanyName(requestDTO.getCompanyName());
        if (requestDTO.getCompanyLogoUrl() != null) recruiter.setCompanyLogoUrl(requestDTO.getCompanyLogoUrl());
        if (requestDTO.getWebsite() != null) recruiter.setWebsite(requestDTO.getWebsite());
        if (requestDTO.getDescription() != null) recruiter.setDescription(requestDTO.getDescription());
        if (requestDTO.getLocation() != null) recruiter.setLocation(requestDTO.getLocation());

        Recruiter updatedRecruiter = recruiterRepository.save(recruiter);
        return mapToResponseDTO(updatedRecruiter);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecruiterResponseDTO> getAllRecruiters() {
        return recruiterRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RecruiterResponseDTO updateRecruiter(Long id, RecruiterRequestDTO requestDTO) {
        Recruiter recruiter = recruiterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with id: " + id));

        securityUtils.validateUserOwnershipOrAdmin(recruiter.getUser().getId());

        recruiter.setCompanyName(requestDTO.getCompanyName());
        if (requestDTO.getCompanyLogoUrl() != null) recruiter.setCompanyLogoUrl(requestDTO.getCompanyLogoUrl());
        if (requestDTO.getWebsite() != null) recruiter.setWebsite(requestDTO.getWebsite());
        if (requestDTO.getDescription() != null) recruiter.setDescription(requestDTO.getDescription());
        if (requestDTO.getLocation() != null) recruiter.setLocation(requestDTO.getLocation());

        Recruiter updatedRecruiter = recruiterRepository.save(recruiter);
        return mapToResponseDTO(updatedRecruiter);
    }

    @Override
    public RecruiterResponseDTO approveRecruiter(Long id) {
        Recruiter recruiter = recruiterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with id: " + id));
        recruiter.setApproved(true);
        Recruiter approvedRecruiter = recruiterRepository.save(recruiter);
        return mapToResponseDTO(approvedRecruiter);
    }

    @Override
    public void deleteRecruiter(Long id) {
        if (!recruiterRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete. Recruiter not found with id: " + id);
        }
        recruiterRepository.deleteById(id);
    }

    public RecruiterResponseDTO mapToResponseDTO(Recruiter recruiter) {
        UserResponseDTO userDTO = UserResponseDTO.builder()
                .id(recruiter.getUser().getId())
                .email(recruiter.getUser().getEmail())
                .role(recruiter.getUser().getRole())
                .enabled(recruiter.getUser().isEnabled())
                .createdAt(recruiter.getUser().getCreatedAt())
                .updatedAt(recruiter.getUser().getUpdatedAt())
                .build();

        return RecruiterResponseDTO.builder()
                .id(recruiter.getId())
                .user(userDTO)
                .companyName(recruiter.getCompanyName())
                .companyLogoUrl(recruiter.getCompanyLogoUrl())
                .website(recruiter.getWebsite())
                .description(recruiter.getDescription())
                .location(recruiter.getLocation())
                .approved(recruiter.isApproved())
                .createdAt(recruiter.getCreatedAt())
                .updatedAt(recruiter.getUpdatedAt())
                .build();
    }
}
