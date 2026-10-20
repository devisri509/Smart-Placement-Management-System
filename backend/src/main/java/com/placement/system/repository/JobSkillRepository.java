package com.placement.system.repository;

import com.placement.system.entity.Job;
import com.placement.system.entity.JobSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobSkillRepository extends JpaRepository<JobSkill, Long> {
    List<JobSkill> findByJob(Job job);
    List<JobSkill> findByJobId(Long jobId);
    void deleteByJobId(Long jobId);
}
