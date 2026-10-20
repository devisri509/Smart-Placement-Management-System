-- =============================================================================
-- Sample Seed Data Script for Smart Internship & Placement Management System
-- =============================================================================

USE placement_db;

-- 1. SEED USERS
-- Password for all seed users is: "Password@123" (BCrypt Hashed)
INSERT INTO users (id, email, password_hash, role, enabled) VALUES
(1, 'admin@placement.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOUVGkqRzgVym5pW83vV2.o5d0w.Zms6e', 'ROLE_ADMIN', TRUE),
(2, 'recruiter.techcorp@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOUVGkqRzgVym5pW83vV2.o5d0w.Zms6e', 'ROLE_RECRUITER', TRUE),
(3, 'recruiter.cloudmatrix@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOUVGkqRzgVym5pW83vV2.o5d0w.Zms6e', 'ROLE_RECRUITER', TRUE),
(4, 'student.rahul@college.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOUVGkqRzgVym5pW83vV2.o5d0w.Zms6e', 'ROLE_STUDENT', TRUE),
(5, 'student.priya@college.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOUVGkqRzgVym5pW83vV2.o5d0w.Zms6e', 'ROLE_STUDENT', TRUE),
(6, 'student.amit@college.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOUVGkqRzgVym5pW83vV2.o5d0w.Zms6e', 'ROLE_STUDENT', TRUE);

-- 2. SEED ADMIN PROFILE
INSERT INTO admins (id, user_id, full_name, department, designation) VALUES
(1, 1, 'Dr. Suresh Sharma', 'Training & Placement Cell', 'Head Placement Officer');

-- 3. SEED RECRUITER PROFILES
INSERT INTO recruiters (id, user_id, company_name, website, description, location, is_approved) VALUES
(1, 2, 'TechCorp Solutions Ltd', 'https://techcorp.example.com', 'Global enterprise IT services & software product developer.', 'Bangalore, India', TRUE),
(2, 3, 'CloudMatrix Systems', 'https://cloudmatrix.example.com', 'Cloud infrastructure and SaaS developer platform.', 'Hyderabad, India', TRUE);

-- 4. SEED STUDENT PROFILES
INSERT INTO students (id, user_id, full_name, phone, roll_number, branch, cgpa, graduation_year, active_backlogs, resume_url) VALUES
(1, 4, 'Rahul Verma', '+91-9876543210', '21CSE045', 'CSE', 8.75, 2026, 0, 'https://drive.example.com/resumes/rahul_verma.pdf'),
(2, 5, 'Priya Sharma', '+91-9876543211', '21ECE088', 'ECE', 8.20, 2026, 0, 'https://drive.example.com/resumes/priya_sharma.pdf'),
(3, 6, 'Amit Patel', '+91-9876543212', '21IT012', 'IT', 7.40, 2026, 1, 'https://drive.example.com/resumes/amit_patel.pdf');

-- 5. SEED EDUCATION HISTORY
INSERT INTO education (student_id, degree, institution, field_of_study, start_year, end_year, percentage_or_cgpa) VALUES
(1, 'B.Tech', 'National Institute of Technology', 'Computer Science & Engineering', 2022, 2026, 8.75),
(1, 'Higher Secondary (12th)', 'Central Public School', 'MPC (Maths, Physics, Chem)', 2020, 2022, 94.50),
(2, 'B.Tech', 'National Institute of Technology', 'Electronics & Communication', 2022, 2026, 8.20),
(3, 'B.Tech', 'State Engineering College', 'Information Technology', 2022, 2026, 7.40);

-- 6. SEED SKILL CATEGORIES
INSERT INTO skill_categories (id, name, description) VALUES
(1, 'Programming Languages', 'Core programming languages for software engineering'),
(2, 'Web Frameworks & Libraries', 'Frontend and backend web development technologies'),
(3, 'Databases & Storage', 'Relational and NoSQL database management systems'),
(4, 'DevOps & Cloud Infrastructure', 'Containerization, CI/CD, and cloud platforms'),
(5, 'Computer Science Fundamentals', 'Data Structures, Algorithms, OS, Networking');

-- 7. SEED MASTER SKILLS
INSERT INTO skills (id, category_id, name, description) VALUES
(1, 1, 'Java', 'Object-oriented programming language'),
(2, 1, 'Python', 'High-level interpreted programming language'),
(3, 1, 'SQL', 'Structured Query Language for database querying'),
(4, 2, 'Spring Boot', 'Java-based enterprise microservices framework'),
(5, 2, 'React.js', 'JavaScript library for user interface development'),
(6, 3, 'MySQL', 'Open-source relational database management system'),
(7, 4, 'Docker', 'Containerization platform for application deployment'),
(8, 4, 'AWS', 'Amazon Web Services cloud hosting platform'),
(9, 5, 'Data Structures & Algorithms', 'Core algorithmic problem solving and logic'),
(10, 2, 'Node.js', 'JavaScript runtime environment');

-- 8. SEED STUDENT SKILLS
INSERT INTO student_skills (student_id, skill_id, proficiency_level, years_of_experience) VALUES
-- Rahul Verma (Java, SQL, Spring Boot, React.js, DSA)
(1, 1, 'ADVANCED', 2.0),
(1, 3, 'ADVANCED', 2.0),
(1, 4, 'INTERMEDIATE', 1.5),
(1, 5, 'INTERMEDIATE', 1.0),
(1, 9, 'EXPERT', 3.0),

-- Priya Sharma (Python, SQL, React.js, Node.js)
(2, 2, 'ADVANCED', 2.0),
(2, 3, 'INTERMEDIATE', 1.5),
(2, 5, 'ADVANCED', 2.0),
(2, 10, 'INTERMEDIATE', 1.0),

-- Amit Patel (Java, SQL, MySQL)
(3, 1, 'INTERMEDIATE', 1.0),
(3, 3, 'INTERMEDIATE', 1.0),
(3, 6, 'BEGINNER', 0.5);

-- 9. SEED JOBS & INTERNSHIPS
INSERT INTO jobs (id, recruiter_id, title, description, location, job_type, package_or_stipend, min_cgpa, allowed_branches, min_graduation_year, max_backlogs_allowed, is_active, deadline) VALUES
(1, 1, 'Software Development Engineer - I', 'Looking for strong Java/Spring Boot developers with solid Data Structures & SQL experience.', 'Bangalore', 'FULL_TIME', 1200000.00, 7.50, 'CSE,IT,ECE', 2026, 0, TRUE, '2026-10-31 23:59:59'),
(2, 1, 'Full Stack Web Developer Intern', '3-month internship program working on React.js, Node.js, and REST APIs with PPO opportunities.', 'Bangalore / Remote', 'INTERNSHIP_WITH_PPO', 40000.00, 7.00, 'CSE,IT,ECE,EEE', 2026, 1, TRUE, '2026-11-15 23:59:59'),
(3, 2, 'Cloud Operations & DevOps Associate', 'Build deployment pipelines using Docker, AWS, and MySQL databases.', 'Hyderabad', 'FULL_TIME', 950000.00, 8.00, 'CSE,IT', 2026, 0, TRUE, '2026-10-15 23:59:59');

-- 10. SEED JOB REQUIRED SKILLS
INSERT INTO job_skills (job_id, skill_id, is_mandatory, minimum_proficiency) VALUES
-- SDE - I (Job 1): Java, Spring Boot, SQL, React.js
(1, 1, TRUE, 'INTERMEDIATE'),
(1, 4, TRUE, 'INTERMEDIATE'),
(1, 3, TRUE, 'INTERMEDIATE'),
(1, 5, FALSE, 'BEGINNER'),
(1, 9, TRUE, 'ADVANCED'),

-- Full Stack Intern (Job 2): React.js, Node.js, SQL
(2, 5, TRUE, 'INTERMEDIATE'),
(2, 10, TRUE, 'INTERMEDIATE'),
(2, 3, TRUE, 'BEGINNER'),

-- DevOps Associate (Job 3): Docker, AWS, MySQL, SQL
(3, 7, TRUE, 'INTERMEDIATE'),
(3, 8, TRUE, 'BEGINNER'),
(3, 6, TRUE, 'INTERMEDIATE'),
(3, 3, TRUE, 'INTERMEDIATE');

-- 11. SEED APPLICATIONS
INSERT INTO applications (id, student_id, job_id, status, skill_match_percentage, applied_at) VALUES
(1, 1, 1, 'TECHNICAL_INTERVIEW', 80.00, '2026-08-10 10:30:00'),
(2, 2, 2, 'SHORTLISTED', 100.00, '2026-08-12 14:15:00'),
(3, 3, 2, 'APPLIED', 33.33, '2026-08-14 16:45:00');

-- 12. SEED APPLICATION STATUS HISTORY
INSERT INTO application_status_history (application_id, status, remarks, changed_by_user_id) VALUES
(1, 'APPLIED', 'Application submitted successfully', 4),
(1, 'SHORTLISTED', 'Profile matched eligibility criteria and high skill match score (80%)', 2),
(1, 'ASSESSMENT', 'Cleared online coding assessment round with score 95/100', 2),
(1, 'TECHNICAL_INTERVIEW', 'Scheduled Round 1 Technical Interview', 2),

(2, 'APPLIED', 'Application submitted for Full Stack Internship', 5),
(2, 'SHORTLISTED', 'Profile shortlisted based on React and Node skill proficiency', 2),

(3, 'APPLIED', 'Application submitted', 6);

-- 13. SEED INTERVIEW SCHEDULE
INSERT INTO interviews (application_id, round_name, interview_type, scheduled_time, duration_minutes, meeting_link_or_location, status, feedback) VALUES
(1, 'Technical Round 1 - Core Java & System Design', 'ONLINE', '2026-08-25 11:00:00', 60, 'https://meet.google.com/xyz-abc-def', 'SCHEDULED', NULL);

-- 14. SEED PREPARATION PROGRESS (Skill Gap Tracker)
INSERT INTO preparation_progress (student_id, skill_id, topic_name, status, completion_percentage, notes) VALUES
-- Rahul Verma preparing for missing Docker & AWS skills for cloud jobs
(1, 7, 'Docker Fundamentals & Containers', 'IN_PROGRESS', 50.00, 'Completed containerization basics & Dockerfile setup'),
(1, 8, 'AWS EC2 & S3 Cloud Deployments', 'NOT_STARTED', 0.00, 'Scheduled for next week');

-- 15. SEED NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(4, 'Technical Interview Scheduled', 'Your Technical Round 1 interview for SDE-I at TechCorp Solutions is scheduled for Aug 25, 2026 at 11:00 AM.', 'INTERVIEW_SCHEDULED', FALSE),
(5, 'Application Shortlisted', 'Congratulations! Your application for Full Stack Web Developer Intern at TechCorp Solutions has been shortlisted.', 'APPLICATION_UPDATE', TRUE);
