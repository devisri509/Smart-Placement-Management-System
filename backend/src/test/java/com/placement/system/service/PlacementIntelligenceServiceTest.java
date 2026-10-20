package com.placement.system.service;

import com.placement.system.dto.request.RecommendationWeightConfigDTO;
import com.placement.system.dto.response.EligibilityResponseDTO;
import com.placement.system.dto.response.SkillMatchResponseDTO;
import com.placement.system.entity.*;
import com.placement.system.entity.enums.JobType;
import com.placement.system.entity.enums.ProficiencyLevel;
import com.placement.system.entity.enums.RoleType;
import com.placement.system.repository.JobRepository;
import com.placement.system.repository.StudentRepository;
import com.placement.system.service.impl.JobServiceImpl;
import com.placement.system.service.impl.PlacementIntelligenceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PlacementIntelligenceServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private JobServiceImpl jobService;

    @InjectMocks
    private PlacementIntelligenceServiceImpl intelligenceService;

    private Student mockStudent;
    private Job mockJob;
    private Skill skillJava;
    private Skill skillSpring;
    private Skill skillReact;

    @BeforeEach
    void setUp() {
        User user = User.builder().id(1L).email("student@test.com").role(RoleType.ROLE_STUDENT).build();
        mockStudent = Student.builder()
                .id(1L)
                .user(user)
                .fullName("Test Student")
                .branch("CSE")
                .cgpa(8.5)
                .graduationYear(2026)
                .activeBacklogs(0)
                .studentSkills(new ArrayList<>())
                .build();

        SkillCategory cat1 = SkillCategory.builder().id(1L).name("Programming").build();
        skillJava = Skill.builder().id(1L).name("Java").category(cat1).build();
        skillSpring = Skill.builder().id(2L).name("Spring Boot").category(cat1).build();
        skillReact = Skill.builder().id(3L).name("React").category(cat1).build();

        // Student has Java and Spring Boot
        mockStudent.getStudentSkills().add(StudentSkill.builder().id(101L).student(mockStudent).skill(skillJava).proficiency(ProficiencyLevel.ADVANCED).build());
        mockStudent.getStudentSkills().add(StudentSkill.builder().id(102L).student(mockStudent).skill(skillSpring).proficiency(ProficiencyLevel.INTERMEDIATE).build());

        Recruiter recruiter = Recruiter.builder().id(1L).companyName("Tech Corp").build();

        mockJob = Job.builder()
                .id(10L)
                .recruiter(recruiter)
                .title("Software Engineer")
                .location("Bangalore")
                .jobType(JobType.FULL_TIME)
                .minCgpa(7.5)
                .allowedBranches("CSE,IT")
                .minGraduationYear(2026)
                .maxBacklogsAllowed(0)
                .deadline(LocalDateTime.now().plusDays(30))
                .active(true)
                .jobSkills(new ArrayList<>())
                .build();

        // Job requires Java, Spring Boot, React
        mockJob.getJobSkills().add(JobSkill.builder().id(201L).job(mockJob).skill(skillJava).mandatory(true).minimumProficiency(ProficiencyLevel.INTERMEDIATE).build());
        mockJob.getJobSkills().add(JobSkill.builder().id(202L).job(mockJob).skill(skillSpring).mandatory(true).minimumProficiency(ProficiencyLevel.INTERMEDIATE).build());
        mockJob.getJobSkills().add(JobSkill.builder().id(203L).job(mockJob).skill(skillReact).mandatory(false).minimumProficiency(ProficiencyLevel.BEGINNER).build());
    }

    @Test
    @DisplayName("Test Eligibility Check - Fully Eligible Student")
    void testEligibilityCheck_Eligible() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(mockStudent));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(mockJob));

        EligibilityResponseDTO response = intelligenceService.checkEligibility(1L, 10L);

        assertTrue(response.isEligible());
        assertTrue(response.getFailedCriteria().isEmpty());
        assertEquals(5, response.getPassedCriteria().size());
    }

    @Test
    @DisplayName("Test Eligibility Check - Low CGPA Ineligible Student")
    void testEligibilityCheck_Ineligible_LowCgpa() {
        mockStudent.setCgpa(6.5); // Required 7.5
        when(studentRepository.findById(1L)).thenReturn(Optional.of(mockStudent));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(mockJob));

        EligibilityResponseDTO response = intelligenceService.checkEligibility(1L, 10L);

        assertFalse(response.isEligible());
        assertEquals(1, response.getFailedCriteria().size());
        assertTrue(response.getFailedCriteria().get(0).contains("CGPA below minimum requirement"));
    }

    @Test
    @DisplayName("Test Skill Match Calculation - 2 of 3 Skills Matched = 66.67%")
    void testCalculateSkillMatch() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(mockStudent));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(mockJob));

        SkillMatchResponseDTO match = intelligenceService.calculateSkillMatch(1L, 10L);

        assertEquals(3, match.getTotalRequiredSkills());
        assertEquals(2, match.getMatchedSkillsCount());
        assertEquals(1, match.getMissingSkillsCount());
        assertEquals(66.67, match.getMatchPercentage());
    }

    @Test
    @DisplayName("Test Overall Recommendation Scoring Formula Calculation")
    void testCalculateOverallRecommendationScore() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(mockStudent));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(mockJob));

        RecommendationWeightConfigDTO weights = RecommendationWeightConfigDTO.builder()
                .skillMatchWeight(0.60)
                .cgpaWeight(0.20)
                .backlogWeight(0.10)
                .graduationYearWeight(0.10)
                .build();

        // Skill Match = 66.67 * 0.60 = 40.002
        // CGPA = (8.5/10)*100 = 85.0 * 0.20 = 17.0
        // Backlogs = 100 * 0.10 = 10.0
        // GradYear = 100 * 0.10 = 10.0
        // Expected Overall = 40.002 + 17.0 + 10.0 + 10.0 = 77.00%

        double overallScore = intelligenceService.calculateOverallRecommendationScore(1L, 10L, weights);

        assertEquals(77.0, overallScore, 0.5);
    }
}
