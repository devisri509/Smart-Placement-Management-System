package com.placement.system.service;

import com.placement.system.dto.request.SkillCategoryRequestDTO;
import com.placement.system.dto.request.SkillRequestDTO;
import com.placement.system.dto.response.SkillCategoryResponseDTO;
import com.placement.system.dto.response.SkillResponseDTO;

import java.util.List;

public interface SkillService {
    SkillCategoryResponseDTO createCategory(SkillCategoryRequestDTO requestDTO);
    List<SkillCategoryResponseDTO> getAllCategories();

    SkillResponseDTO createSkill(SkillRequestDTO requestDTO);
    SkillResponseDTO getSkillById(Long id);
    List<SkillResponseDTO> getAllSkills();
    List<SkillResponseDTO> getSkillsByCategoryId(Long categoryId);
    void deleteSkill(Long id);
}
