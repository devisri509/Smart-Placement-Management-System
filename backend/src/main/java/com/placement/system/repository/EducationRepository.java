package com.placement.system.repository;

import com.placement.system.entity.Education;
import com.placement.system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByStudent(Student student);
    List<Education> findByStudentId(Long studentId);
}
