package com.placement.system.service.impl;

import com.placement.system.dto.request.SkillCategoryRequestDTO;
import com.placement.system.dto.request.SkillRequestDTO;
import com.placement.system.dto.response.SkillCategoryResponseDTO;
import com.placement.system.dto.response.SkillResponseDTO;
import com.placement.system.entity.Skill;
import com.placement.system.entity.SkillCategory;
import com.placement.system.exception.DuplicateResourceException;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.repository.SkillCategoryRepository;
import com.placement.system.repository.SkillRepository;
import com.placement.system.service.SkillService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final SkillCategoryRepository categoryRepository;

    public SkillServiceImpl(SkillRepository skillRepository, SkillCategoryRepository categoryRepository) {
        this.skillRepository = skillRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public SkillCategoryResponseDTO createCategory(SkillCategoryRequestDTO requestDTO) {
        if (categoryRepository.existsByNameIgnoreCase(requestDTO.getName())) {
            throw new DuplicateResourceException("Category already exists with name: " + requestDTO.getName());
        }

        SkillCategory category = SkillCategory.builder()
                .name(requestDTO.getName())
                .description(requestDTO.getDescription())
                .build();

        SkillCategory savedCategory = categoryRepository.save(category);
        return mapCategoryToResponseDTO(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillCategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapCategoryToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SkillResponseDTO createSkill(SkillRequestDTO requestDTO) {
        SkillCategory category = categoryRepository.findById(requestDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill category not found with id: " + requestDTO.getCategoryId()));

        if (skillRepository.existsByNameIgnoreCase(requestDTO.getName())) {
            throw new DuplicateResourceException("Skill already exists with name: " + requestDTO.getName());
        }

        Skill skill = Skill.builder()
                .category(category)
                .name(requestDTO.getName())
                .description(requestDTO.getDescription())
                .build();

        Skill savedSkill = skillRepository.save(skill);
        return mapSkillToResponseDTO(savedSkill);
    }

    @Override
    @Transactional(readOnly = true)
    public SkillResponseDTO getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        return mapSkillToResponseDTO(skill);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponseDTO> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(this::mapSkillToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponseDTO> getSkillsByCategoryId(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
        }
        return skillRepository.findByCategoryId(categoryId).stream()
                .map(this::mapSkillToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteSkill(Long id) {
        if (!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete. Skill not found with id: " + id);
        }
        skillRepository.deleteById(id);
    }

    public SkillCategoryResponseDTO mapCategoryToResponseDTO(SkillCategory category) {
        return SkillCategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    public SkillResponseDTO mapSkillToResponseDTO(Skill skill) {
        return SkillResponseDTO.builder()
                .id(skill.getId())
                .category(mapCategoryToResponseDTO(skill.getCategory()))
                .name(skill.getName())
                .description(skill.getDescription())
                .createdAt(skill.getCreatedAt())
                .build();
    }
}
