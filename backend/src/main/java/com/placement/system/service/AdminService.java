package com.placement.system.service;

import com.placement.system.dto.request.AdminRequestDTO;
import com.placement.system.dto.response.AdminResponseDTO;

import java.util.List;

public interface AdminService {
    AdminResponseDTO createAdmin(AdminRequestDTO requestDTO);
    AdminResponseDTO getAdminById(Long id);
    AdminResponseDTO getAdminByUserId(Long userId);
    List<AdminResponseDTO> getAllAdmins();
    void deleteAdmin(Long id);
}
