package com.placement.system.service;

import com.placement.system.dto.request.RecruiterRequestDTO;
import com.placement.system.dto.response.RecruiterResponseDTO;

import java.util.List;

public interface RecruiterService {
    RecruiterResponseDTO createRecruiter(RecruiterRequestDTO requestDTO);
    RecruiterResponseDTO getRecruiterById(Long id);
    RecruiterResponseDTO getRecruiterByUserId(Long userId);
    RecruiterResponseDTO getCurrentRecruiterProfile();
    RecruiterResponseDTO updateCurrentRecruiterProfile(RecruiterRequestDTO requestDTO);
    List<RecruiterResponseDTO> getAllRecruiters();
    RecruiterResponseDTO updateRecruiter(Long id, RecruiterRequestDTO requestDTO);
    RecruiterResponseDTO approveRecruiter(Long id);
    void deleteRecruiter(Long id);
}
