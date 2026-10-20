package com.placement.system.entity;

import com.placement.system.entity.enums.ProficiencyLevel;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"job_id", "skill_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Builder.Default
    @Column(name = "is_mandatory", nullable = false)
    private boolean mandatory = true;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "minimum_proficiency", nullable = false)
    private ProficiencyLevel minimumProficiency = ProficiencyLevel.BEGINNER;
}
