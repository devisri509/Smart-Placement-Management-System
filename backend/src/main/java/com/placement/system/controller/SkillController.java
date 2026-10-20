package com.placement.system.controller;

import com.placement.system.dto.ApiResponse;
import com.placement.system.dto.request.SkillCategoryRequestDTO;
import com.placement.system.dto.request.SkillRequestDTO;
import com.placement.system.dto.response.SkillCategoryResponseDTO;
import com.placement.system.dto.response.SkillResponseDTO;
import com.placement.system.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<SkillCategoryResponseDTO>> createCategory(@Valid @RequestBody SkillCategoryRequestDTO requestDTO) {
        SkillCategoryResponseDTO category = skillService.createCategory(requestDTO);
        return new ResponseEntity<>(ApiResponse.success("Skill category created successfully", category), HttpStatus.CREATED);
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<SkillCategoryResponseDTO>>> getAllCategories() {
        List<SkillCategoryResponseDTO> categories = skillService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("All skill categories retrieved successfully", categories));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SkillResponseDTO>> createSkill(@Valid @RequestBody SkillRequestDTO requestDTO) {
        SkillResponseDTO skill = skillService.createSkill(requestDTO);
        return new ResponseEntity<>(ApiResponse.success("Master skill created successfully", skill), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillResponseDTO>> getSkillById(@PathVariable Long id) {
        SkillResponseDTO skill = skillService.getSkillById(id);
        return ResponseEntity.ok(ApiResponse.success("Skill retrieved successfully", skill));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillResponseDTO>>> getAllSkills() {
        List<SkillResponseDTO> skills = skillService.getAllSkills();
        return ResponseEntity.ok(ApiResponse.success("All master skills retrieved successfully", skills));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<SkillResponseDTO>>> getSkillsByCategoryId(@PathVariable Long categoryId) {
        List<SkillResponseDTO> skills = skillService.getSkillsByCategoryId(categoryId);
        return ResponseEntity.ok(ApiResponse.success("Skills retrieved for category successfully", skills));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.ok(ApiResponse.success("Skill deleted successfully", null));
    }
}
