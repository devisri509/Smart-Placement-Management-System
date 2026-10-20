# Database Design & Schema Documentation
## Smart Internship & Placement Management System with Skill Matching and Skill-Gap Analysis

---

## 1. Textual ER Diagram Description

```text
+------------------+             1:1             +-------------------+
|      USERS       | <-------------------------> |     STUDENTS      |
+------------------+                             +-------------------+
| PK id            |                               | PK id             |
| UK email         |                               | FK user_id (1:1)  |
|    password_hash |                               |    roll_number    |
|    role          |                               |    cgpa           |
|    enabled       |                               |    branch         |
+------------------+                               +-------------------+
        ^                                                    |
        | 1:1                                                | 1:N
        v                                                    v
+------------------+                             +-------------------+
|    RECRUITERS    |                             |     EDUCATION     |
+------------------+                             +-------------------+
| PK id            |                             | PK id             |
| FK user_id (1:1) |                             | FK student_id     |
|    company_name  |                             |    degree         |
|    is_approved   |                             |    cgpa/percentage|
+------------------+                             +-------------------+
        ^
        | 1:N
        v
+------------------+             N:M             +-------------------+
|       JOBS       | <-------------------------> |      SKILLS       |
+------------------+      (via job_skills)       +-------------------+
| PK id            |                               | PK id             |
| FK recruiter_id  |                               | FK category_id    |
|    title         |                               | UK name           |
|    min_cgpa      |                               +-------------------+
|    job_type      |                                         ^
+------------------+                                         | N:M (via student_skills)
        ^                                                    v
        | 1:N                                    +-------------------+
        v                                        |  STUDENT_SKILLS   |
+------------------+                             +-------------------+
|   APPLICATIONS   |                             | PK id             |
+------------------+                             | FK student_id     |
| PK id            |                             | FK skill_id       |
| FK student_id    |                             |    proficiency    |
| FK job_id        |                             +-------------------+
|    status        |
|    match_pct     |
+------------------+
   |             \
   | 1:N          \ 1:N
   v               v
+------------------------+      +-------------------+
| APP_STATUS_HISTORY     |      |    INTERVIEWS     |
+------------------------+      +-------------------+
| PK id                  |      | PK id             |
| FK application_id      |      | FK application_id |
|    status              |      |    round_name     |
|    remarks             |      |    scheduled_time |
+------------------------+      +-------------------+

+-----------------------+       +-------------------+
| PREPARATION_PROGRESS  |       |   NOTIFICATIONS   |
+-----------------------+       +-------------------+
| PK id                 |       | PK id             |
| FK student_id         |       | FK user_id        |
| FK skill_id           |       |    title, message |
|    completion_pct     |       |    is_read        |
+-----------------------+       +-------------------+
```

---

## 2. Table Explanation & Normalized Purpose

| Table Name | Primary Key | Main Foreign Keys | Purpose & Value in System |
| :--- | :--- | :--- | :--- |
| **`users`** | `id` | None | Base authentication credentials (`email`, `password_hash`, `role`). Protects user isolation. |
| **`students`** | `id` | `user_id` $\rightarrow$ `users(id)` | Role-specific profile storing academic criteria (`cgpa`, `branch`, `graduation_year`, `backlogs`). |
| **`recruiters`** | `id` | `user_id` $\rightarrow$ `users(id)` | Company information, website, approval state by admin. |
| **`admins`** | `id` | `user_id` $\rightarrow$ `users(id)` | Placement Cell administration officers details. |
| **`education`** | `id` | `student_id` $\rightarrow$ `students(id)` | Normalized 1:N academic records (10th, 12th, B.Tech, M.Tech). |
| **`skill_categories`** | `id` | None | Taxonomy categories (Programming, Web, Databases, Cloud, CS Core). |
| **`skills`** | `id` | `category_id` $\rightarrow$ `skill_categories(id)` | Master repository of individual skills. |
| **`student_skills`** | `id` | `student_id`, `skill_id` | **Junction Table** (N:M): Tracks student skills & proficiency (`BEGINNER` $\rightarrow$ `EXPERT`). |
| **`jobs`** | `id` | `recruiter_id` $\rightarrow$ `recruiters(id)` | Job & internship postings with eligibility criteria. |
| **`job_skills`** | `id` | `job_id`, `skill_id` | **Junction Table** (N:M): Stores recruiter mandatory/optional required skills for matching. |
| **`applications`** | `id` | `student_id`, `job_id` | Connects Student applications to Jobs with calculated `skill_match_percentage`. |
| **`application_status_history`** | `id` | `application_id` | Immutable audit log of stage transitions (`APPLIED` $\rightarrow$ `SELECTED`/`REJECTED`). |
| **`interviews`** | `id` | `application_id` | Scheduled interview rounds, meeting links, timing, and feedback. |
| **`preparation_progress`** | `id` | `student_id`, `skill_id` | Learning tracker where students bridge their skill gaps. |
| **`notifications`** | `id` | `user_id` $\rightarrow$ `users(id)` | System & interview notifications sent to users. |

---

## 3. Foreign Key Cascade Behaviors & Rationale

1. **`users` $\rightarrow$ `students` / `recruiters` / `admins` / `notifications`**:
   - `ON DELETE CASCADE ON UPDATE CASCADE`: Deleting an auth user profile safely cleans up associated role profiles and notifications.
2. **`students` / `jobs` $\rightarrow$ `applications`**:
   - `ON DELETE RESTRICT ON UPDATE CASCADE`: **Crucial Rule**: Prevents deleting a student or job record if active placement application history exists, preserving audit integrity for college viva & placement reports.
3. **`applications` $\rightarrow$ `application_status_history` / `interviews`**:
   - `ON DELETE CASCADE ON UPDATE CASCADE`: Deleting an application automatically purges associated interview schedules and audit logs.
4. **`skills` $\rightarrow$ `student_skills` / `job_skills`**:
   - `ON DELETE RESTRICT ON UPDATE CASCADE`: Master skills referenced in student profiles or job postings cannot be deleted accidentally.

---

## 4. Indexing Strategy

- **Lookup Indexes**: `users.email` (UNIQUE), `students.roll_number` (UNIQUE), `skills.name` (UNIQUE).
- **Filtering Indexes**:
  - `students`: `branch`, `cgpa`, `graduation_year` for instant eligibility engine queries.
  - `jobs`: `(is_active, deadline)`, `min_cgpa`, `job_type` for high-performance job stream searches.
  - `applications`: `(student_id, status)` and `(job_id, status)` for fast dashboard status tracking.
  - `notifications`: `(user_id, is_read)` for unread alert counts.

---

## 5. How to Run Scripts in MySQL

```bash
# Execute schema setup
mysql -u root -p < database/schema.sql

# Load development seed data
mysql -u root -p placement_db < database/seed.sql
```
