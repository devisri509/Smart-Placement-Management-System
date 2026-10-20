package com.placement.system.entity;

import com.placement.system.entity.enums.JobType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private Recruiter recruiter;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 150)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false)
    private JobType jobType;

    @Column(name = "package_or_stipend", columnDefinition = "DECIMAL(12,2)")
    private Double packageOrStipend;

    @Builder.Default
    @Column(name = "min_cgpa", nullable = false, columnDefinition = "DECIMAL(4,2)")
    private Double minCgpa = 0.0;

    @Builder.Default
    @Column(name = "allowed_branches", nullable = false, length = 255)
    private String allowedBranches = "CSE,IT,ECE,EEE,MECH,CIVIL";

    @Column(name = "min_graduation_year")
    private Integer minGraduationYear;

    @Builder.Default
    @Column(name = "max_backlogs_allowed", nullable = false)
    private Integer maxBacklogsAllowed = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer openings = 1;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<JobSkill> jobSkills = new ArrayList<>();
}
