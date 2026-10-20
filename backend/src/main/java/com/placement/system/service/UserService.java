package com.placement.system.service;

import com.placement.system.dto.request.UserRequestDTO;
import com.placement.system.dto.response.UserResponseDTO;

import java.util.List;

public interface UserService {
    UserResponseDTO createUser(UserRequestDTO requestDTO);
    UserResponseDTO getUserById(Long id);
    UserResponseDTO getUserByEmail(String email);
    List<UserResponseDTO> getAllUsers();
    void deleteUser(Long id);
}
