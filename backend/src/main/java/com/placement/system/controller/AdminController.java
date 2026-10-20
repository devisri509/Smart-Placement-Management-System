package com.placement.system.controller;

import com.placement.system.dto.ApiResponse;
import com.placement.system.dto.request.AdminRequestDTO;
import com.placement.system.dto.response.AdminResponseDTO;
import com.placement.system.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminResponseDTO>> createAdmin(@Valid @RequestBody AdminRequestDTO requestDTO) {
        AdminResponseDTO admin = adminService.createAdmin(requestDTO);
        return new ResponseEntity<>(ApiResponse.success("Admin profile created successfully", admin), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminResponseDTO>> getAdminById(@PathVariable Long id) {
        AdminResponseDTO admin = adminService.getAdminById(id);
        return ResponseEntity.ok(ApiResponse.success("Admin profile retrieved successfully", admin));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<AdminResponseDTO>> getAdminByUserId(@PathVariable Long userId) {
        AdminResponseDTO admin = adminService.getAdminByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Admin profile retrieved successfully", admin));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminResponseDTO>>> getAllAdmins() {
        List<AdminResponseDTO> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(ApiResponse.success("All admin profiles retrieved successfully", admins));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Admin profile deleted successfully", null));
    }
}
