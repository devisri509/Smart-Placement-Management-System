package com.placement.system.repository;

import com.placement.system.entity.Application;
import com.placement.system.entity.Job;
import com.placement.system.entity.Student;
import com.placement.system.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByStudentAndJob(Student student, Job job);
    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);
    Optional<Application> findByStudentAndJob(Student student, Job job);
    Page<Application> findByStudent(Student student, Pageable pageable);
    Page<Application> findByJob(Job job, Pageable pageable);
    Page<Application> findByJobAndStatus(Job job, ApplicationStatus status, Pageable pageable);
    Page<Application> findByStatus(ApplicationStatus status, Pageable pageable);
}
