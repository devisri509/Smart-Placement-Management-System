package com.placement.system.repository;

import com.placement.system.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, Long> {
    Optional<SkillCategory> findByNameIgnoreCase(String name);
    Boolean existsByNameIgnoreCase(String name);
}
