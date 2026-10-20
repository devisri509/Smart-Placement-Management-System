-- =============================================================================
-- Database Schema Script for Smart Internship & Placement Management System
-- Database Engine: MySQL 8.0+ (InnoDB, utf8mb4)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS placement_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE placement_db;

-- Disable Foreign Key checks for clean teardown and rebuild
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS preparation_progress;
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS application_status_history;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS job_skills;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS student_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS skill_categories;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS recruiters;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- 1. USERS TABLE (Authentication Core)
-- =============================================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ROLE_STUDENT', 'ROLE_RECRUITER', 'ROLE_ADMIN') NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =============================================================================
-- 2. STUDENTS TABLE (Student Role Profile)
-- =============================================================================
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    cgpa DECIMAL(4, 2) NOT NULL,
    graduation_year INT NOT NULL,
    active_backlogs INT NOT NULL DEFAULT 0,
    resume_url VARCHAR(500) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_students_user_id UNIQUE (user_id),
    CONSTRAINT uk_students_roll_number UNIQUE (roll_number),
    CONSTRAINT fk_students_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_students_branch ON students(branch);
CREATE INDEX idx_students_cgpa ON students(cgpa);
CREATE INDEX idx_students_grad_year ON students(graduation_year);

-- =============================================================================
-- 3. RECRUITERS TABLE (Recruiter / Company Profile)
-- =============================================================================
CREATE TABLE recruiters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    company_logo_url VARCHAR(500) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    location VARCHAR(150) DEFAULT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_recruiters_user_id UNIQUE (user_id),
    CONSTRAINT fk_recruiters_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_recruiters_approved ON recruiters(is_approved);
CREATE INDEX idx_recruiters_company_name ON recruiters(company_name);

-- =============================================================================
-- 4. ADMINS TABLE (Placement Officers & Staff)
-- =============================================================================
CREATE TABLE admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) DEFAULT 'Placement Cell',
    designation VARCHAR(100) DEFAULT 'Placement Officer',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_admins_user_id UNIQUE (user_id),
    CONSTRAINT fk_admins_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 5. EDUCATION TABLE (Academic History per Student)
-- =============================================================================
CREATE TABLE education (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    degree VARCHAR(100) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(100) NOT NULL,
    start_year INT NOT NULL,
    end_year INT NOT NULL,
    percentage_or_cgpa DECIMAL(4, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_education_students FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_education_student ON education(student_id);

-- =============================================================================
-- 6. SKILL CATEGORIES TABLE (Normalized Category Taxonomy)
-- =============================================================================
CREATE TABLE skill_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    CONSTRAINT uk_skill_categories_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 7. SKILLS TABLE (Master Skill Repository)
-- =============================================================================
CREATE TABLE skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_skills_name UNIQUE (name),
    CONSTRAINT fk_skills_categories FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category_id);

-- =============================================================================
-- 8. STUDENT SKILLS TABLE (Junction Table: Student <-> Skill)
-- =============================================================================
CREATE TABLE student_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL DEFAULT 'INTERMEDIATE',
    years_of_experience DECIMAL(3, 1) NOT NULL DEFAULT 0.0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_student_skill UNIQUE (student_id, skill_id),
    CONSTRAINT fk_student_skills_students FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_student_skills_skills FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_student_skills_student ON student_skills(student_id);
CREATE INDEX idx_student_skills_skill ON student_skills(skill_id);

-- =============================================================================
-- 9. JOBS TABLE (Job & Internship Openings)
-- =============================================================================
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    job_type ENUM('FULL_TIME', 'INTERNSHIP', 'INTERNSHIP_WITH_PPO') NOT NULL,
    package_or_stipend DECIMAL(12, 2) DEFAULT NULL,
    min_cgpa DECIMAL(4, 2) NOT NULL DEFAULT 0.00,
    allowed_branches VARCHAR(255) NOT NULL DEFAULT 'CSE,IT,ECE,EEE,MECH,CIVIL',
    min_graduation_year INT DEFAULT NULL,
    max_backlogs_allowed INT NOT NULL DEFAULT 0,
    openings INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deadline DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_jobs_recruiters FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_jobs_recruiter ON jobs(recruiter_id);
CREATE INDEX idx_jobs_active_deadline ON jobs(is_active, deadline);
CREATE INDEX idx_jobs_min_cgpa ON jobs(min_cgpa);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);

-- =============================================================================
-- 10. JOB SKILLS TABLE (Junction Table: Job <-> Skill)
-- =============================================================================
CREATE TABLE job_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    minimum_proficiency ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL DEFAULT 'BEGINNER',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_job_skill UNIQUE (job_id, skill_id),
    CONSTRAINT fk_job_skills_jobs FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_job_skills_skills FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_job_skills_job ON job_skills(job_id);
CREATE INDEX idx_job_skills_skill ON job_skills(skill_id);

-- =============================================================================
-- 11. APPLICATIONS TABLE (Student Job Submissions)
-- =============================================================================
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    status ENUM('APPLIED', 'SHORTLISTED', 'ASSESSMENT', 'TECHNICAL_INTERVIEW', 'HR_INTERVIEW', 'SELECTED', 'REJECTED') NOT NULL DEFAULT 'APPLIED',
    skill_match_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_student_job_app UNIQUE (student_id, job_id),
    CONSTRAINT fk_applications_students FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_applications_jobs FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_applications_student_status ON applications(student_id, status);
CREATE INDEX idx_applications_job_status ON applications(job_id, status);
CREATE INDEX idx_applications_status ON applications(status);

-- =============================================================================
-- 12. APPLICATION STATUS HISTORY TABLE (Multi-Stage Audit Trail)
-- =============================================================================
CREATE TABLE application_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    status ENUM('APPLIED', 'SHORTLISTED', 'ASSESSMENT', 'TECHNICAL_INTERVIEW', 'HR_INTERVIEW', 'SELECTED', 'REJECTED') NOT NULL,
    remarks TEXT DEFAULT NULL,
    changed_by_user_id BIGINT DEFAULT NULL,
    changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_history_applications FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_app_history_users FOREIGN KEY (changed_by_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_app_history_application ON application_status_history(application_id);

-- =============================================================================
-- 13. INTERVIEWS TABLE (Scheduled Rounds per Application)
-- =============================================================================
CREATE TABLE interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    round_name VARCHAR(100) NOT NULL,
    interview_type ENUM('ONLINE', 'OFFLINE', 'TELEPHONIC') NOT NULL DEFAULT 'ONLINE',
    scheduled_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    meeting_link_or_location VARCHAR(500) DEFAULT NULL,
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED') NOT NULL DEFAULT 'SCHEDULED',
    feedback TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_interviews_applications FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interviews_scheduled_time ON interviews(scheduled_time);

-- =============================================================================
-- 14. PREPARATION PROGRESS TABLE (Skill Gap Learning Tracker)
-- =============================================================================
CREATE TABLE preparation_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    topic_name VARCHAR(150) NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    completion_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    notes TEXT DEFAULT NULL,
    last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_student_skill_topic UNIQUE (student_id, skill_id, topic_name),
    CONSTRAINT fk_prep_progress_students FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_prep_progress_skills FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_prep_progress_student ON preparation_progress(student_id);
CREATE INDEX idx_prep_progress_skill ON preparation_progress(skill_id);

-- =============================================================================
-- 15. NOTIFICATIONS TABLE (System & User Alerts)
-- =============================================================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('APPLICATION_UPDATE', 'INTERVIEW_SCHEDULED', 'JOB_ALERT', 'SYSTEM') NOT NULL DEFAULT 'SYSTEM',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
