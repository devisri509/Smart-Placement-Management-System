package com.placement.system.repository;

import com.placement.system.entity.Job;
import com.placement.system.entity.Recruiter;
import com.placement.system.entity.enums.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    Page<Job> findByRecruiter(Recruiter recruiter, Pageable pageable);
    Page<Job> findByRecruiterId(Long recruiterId, Pageable pageable);
    List<Job> findByRecruiterId(Long recruiterId);

    Page<Job> findByActiveTrueAndDeadlineAfter(LocalDateTime now, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.active = true AND j.deadline > :now " +
           "AND (:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(j.location) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(j.recruiter.companyName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:jobType IS NULL OR j.jobType = :jobType) " +
           "AND (:branch IS NULL OR j.allowedBranches LIKE CONCAT('%', :branch, '%')) " +
           "AND (:maxCgpa IS NULL OR j.minCgpa <= :maxCgpa) " +
           "AND (:gradYear IS NULL OR j.minGraduationYear IS NULL OR j.minGraduationYear = :gradYear)")
    Page<Job> searchAndFilterJobs(
            @Param("now") LocalDateTime now,
            @Param("search") String search,
            @Param("jobType") JobType jobType,
            @Param("branch") String branch,
            @Param("maxCgpa") Double maxCgpa,
            @Param("gradYear") Integer gradYear,
            Pageable pageable
    );
}
