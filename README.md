# 🚀 CareerPilot AI

CareerPilot AI is an AI-powered recruitment and career platform with three connected experiences:

1. **Job Seeker / Employee Portal** - create an account, upload a resume, build a profile, discover relevant active jobs, apply, and track applications.
2. **Employer / Admin / HR Portal** - create an employer account, publish/manage jobs, receive applications, review resumes, screen candidates with AI, rank candidates, manage interviews, and hire/reject.
3. **Public Resume Checker** - upload a PDF/DOCX resume without an account and receive ATS score, resume quality, skill matching, missing skills, semantic analysis, and improvement suggestions.

## 🏗️ Product Architecture

```text
                         CAREERPILOT AI
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
        JOB SEEKER        EMPLOYER / HR    RESUME CHECKER
             |                |                |
       Create account     Create account    No account needed
             |                |                |
       Upload resume      Create jobs       Upload resume
             |                |                |
       Build profile      Get applicants     ATS analysis
             |                |                |
       Job matching      AI screening        Job matching
             |                |                |
       Apply             Rank candidates     Suggestions
             |                |
       Track status      Interview
                          |
                       Hire/Reject
```

## 👤 1. Job Seeker / Employee

The registered employee can:

- 📝 Create an account and log in
- 📄 Upload a resume once
- 🔄 Replace/update the resume
- 🧠 Automatically extract skills, education, and experience
- 👤 Build a candidate profile from the resume
- 💼 View recommended jobs
- 🔎 Browse all active jobs
- 🔍 Search and filter jobs
- 📋 View job details
- 📤 Apply to jobs
- 📊 Track application status
- 🎤 View interview information
- ⚙️ Manage settings

### 🔄 Employee Workflow

```text
Create Account
 -> Upload Resume
 -> Parse Resume
 -> Extract Skills / Education / Experience
 -> Build Profile
 -> Recommend Active Jobs
 -> View Job
 -> Apply
 -> Track Application
 -> Interview
```

### 💼 Recommended Jobs

Recommendations should consider:

- Resume skills
- Required skills
- Preferred skills
- Education
- Experience
- Job-title relevance
- Semantic relevance where appropriate

**Expired or closed jobs must not be recommended.**

A job is no longer active when:

```text
current_time > application_deadline
```

or when the employer manually closes it.

## 🏢 2. Employer / Admin / HR

Employer navigation:

```text
Dashboard
Jobs
Applicants
Candidates
Resume Screening
Interviews
Analytics
Settings
```

### 📊 Employer Dashboard

Show:

- Active jobs
- Total applications
- New applicants
- ⭐ Shortlisted candidates
- Interviews
- Hires
- Recent applications
- Recent jobs
- Hiring pipeline

### 📝 Job Management

Employers can:

- Create jobs
- Edit jobs
- Publish jobs
- Close jobs
- Archive/delete jobs
- Set application deadline
- Set required skills
- Set preferred skills
- Set education
- Set experience range
- Set location
- Set employment type
- Set salary range
- Add job description

Example:

```text
Software Engineer

Required:
Python
FastAPI
SQL
Git

Preferred:
React
Docker
AWS

Education:
B.Tech / B.E / MCA

Experience:
0-2 years

Location:
Chandigarh / Remote

Deadline:
30 September 2026
```

### 👥 Applicant Management

When people apply to a job:

```text
Job
 |
 +-- Applications
       |
       +-- Candidate
       +-- Resume
       +-- Application date
       +-- ATS score
       +-- Match score
       +-- Status
```

HR can:

- 👥 View applicants
- 👤 Open candidate profiles
- 📄 View resumes
- 🤖 View ATS analysis
- ✅ View matched skills
- ❌ View missing skills
- 🎓 View education
- 💼 View experience
- ⭐ Shortlist
- ❌ Reject
- 🎤 Move to interview
- 🎉 Mark hired

Application statuses:

```text
Applied
Under Review
Shortlisted
Interview
Selected
Rejected
Withdrawn
```

## 🤖 3. AI Resume Screening

For every candidate/job pair, show:

```text
ATS Score
Skill Match
Required Skills
Preferred Skills
Education Match
Experience Match
Resume Quality
Matched Skills
Missing Skills
Recommendation
```

HR should be able to sort candidates by:

- ATS score
- Match score
- Experience
- Application date
- Status

AI should assist HR decision-making and should not make irreversible hiring decisions automatically.

## 📄 4. Public Resume Checker

A visitor can upload a PDF or DOCX without creating an account.

### 🔍 Resume Analyzer

Optional inputs:

```text
Target role
Focus skills
```

Results:

```text
ATS Score
Resume Quality
Required Skills
Preferred Skills
Skills Coverage
Education
Experience
Matched Skills
Missing Skills
Semantic Analysis
Improvement Suggestions
```

The frontend must use the real backend ATS result. Do not hardcode scores.

### 🎯 Job Match

A candidate can paste a real job description and compare it against their resume.

Show:

```text
Overall Match
Matched Skills
Missing Skills
Education Match
Experience Match
Keyword Match
Semantic Match
Suggestions
```

## ⚙️ 5. Backend

Backend technology:

```text
FastAPI
Python
```

Current structure:

```text
backend/
└── app/
    ├── config.py
    ├── main.py
    ├── models/
    │   ├── schemas.py
    │   └── embedding_model.py
    ├── routes/
    │   ├── health.py
    │   ├── resume.py
    │   ├── job.py
    │   ├── interview.py
    │   └── ats.py
    └── services/
        ├── resume_analyzer.py
        ├── resume_parser.py
        ├── job_matcher.py
        ├── interview_service.py
        ├── skill_normalizer.py
        ├── skill_extractor.py
        ├── education_matcher.py
        ├── job_requirement_analyzer.py
        ├── semantic_matcher.py
        ├── experience_extractor.py
        ├── experience_matcher.py
        ├── contextual_matcher.py
        └── evidence_matcher.py
```

### 🔌 Current API

```text
GET  /api/health
POST /api/resume/upload
POST /api/job/match
POST /api/interview/start
POST /api/interview/evaluate
POST /api/ats/analyze
GET  /
```

Development backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### 📡 ATS Endpoint

```text
POST /api/ats/analyze
```

Multipart fields:

```text
file
job_title
job_description
required_keywords
preferred_keywords
education
experience_min
experience_max
```

### 🧮 ATS Scoring

Current weights:

```text
Required skills     40%
Preferred skills    15%
Education           10%
Experience          10%
Resume quality      10%
Skill coverage      15%
```

The engine performs normalized/exact matching first and uses contextual semantic matching for suitable misses.

## 📑 6. Resume Processing

Supported:

```text
PDF
DOCX
```

Extract:

- Resume text
- Email
- Phone
- Sections
- Skills
- Education
- Experience
- Word count
- Filename

Skill normalization supports aliases such as:

```text
JS -> JavaScript
ReactJS -> React
NodeJS -> Node
Postgres -> PostgreSQL
ML -> Machine Learning
AI -> Artificial Intelligence
```

## 🧠 7. Semantic Matching

The project uses:

```text
sentence-transformers
all-MiniLM-L6-v2
```

Semantic matching can help with:

- Resume/job relevance
- Skill/context similarity
- Candidate/job matching

Semantic similarity must be supported by resume evidence when deciding whether a candidate actually has a skill.

## 💻 8. Frontend

Technology:

```text
React
Vite
JavaScript
CSS
```

Project:

```text
frontend/frontend
```

Structure:

```text
frontend/
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

Development frontend:

```text
http://localhost:5173
```

Backend base URL:

```javascript
const API = "http://127.0.0.1:8000";
```

Example ATS request:

```javascript
fetch(`${API}/api/ats/analyze`, {
  method: "POST",
  body: formData
});
```

Do not manually set `Content-Type` when sending `FormData`.

## 🗄️ 9. Database Plan

Production should use a persistent database.

Suggested entities:

```text
User
Employer
JobSeekerProfile
Resume
Job
Application
Candidate
Interview
Notification
ATSAnalysis
```

### 👤 User

```text
id
name
email
password_hash
role
created_at
updated_at
```

Roles:

```text
job_seeker
employer
admin
```

### 💼 Job

```text
id
employer_id
title
description
required_skills
preferred_skills
education
experience_min
experience_max
location
employment_type
salary_min
salary_max
deadline
status
created_at
updated_at
```

### 📄 Resume

```text
id
user_id
filename
file_storage_reference
extracted_text
skills
education
experience
created_at
updated_at
```

### 📋 Application

```text
id
job_id
candidate_id
resume_id
ats_score
match_score
status
applied_at
updated_at
```

## ⏰ 10. Job Deadline Logic

Jobs have:

```text
ACTIVE
CLOSED
EXPIRED
```

Only ACTIVE jobs should appear in:

- Recommended Jobs
- All Jobs
- Search results

A job becomes EXPIRED after its deadline. Employers can manually close an ACTIVE job earlier.

## 🎯 11. Candidate Recommendation Logic

Example:

```text
Python Developer        92%
Data Analyst            84%
ML Engineer              79%
Cybersecurity Engineer   31%
```

Recommended jobs should be ranked using a combination of:

```text
Skill Match
Job Title Relevance
Education Match
Experience Match
Semantic Relevance
```

Expired jobs must be filtered out before ranking/displaying recommendations.

## 🏆 12. Employer Candidate Ranking

```text
Application
    |
    v
Resume Parsing
    |
    v
ATS Analysis
    |
    v
Candidate/Job Match
    |
    v
Ranking
    |
    v
HR Shortlist
    |
    v
Interview
    |
    v
Hire / Reject
```

Example:

```text
1. Candidate A  94
2. Candidate B  91
3. Candidate C  86
4. Candidate D  74
5. Candidate E  62
```

## 🎤 13. Interviews

Existing APIs:

```text
POST /api/interview/start
POST /api/interview/evaluate
```

Future interview features:

- 💻 Technical questions
- 👔 HR questions
- 📊 Difficulty levels
- 🎯 Job-specific questions
- 👤 Candidate-specific questions
- 🏆 Interview score
- 💬 Feedback
- 🕒 Interview history

## 📈 14. Analytics

Employer analytics can show:

```text
Jobs Posted
Applications
Applicants Per Job
Average ATS Score
Shortlist Rate
Interview Rate
Hiring Rate
Rejected Candidates
Time to Hire
```

Possible charts:

- 📈 Applications over time
- 🔽 Hiring funnel
- 💼 Job performance
- 👥 Candidate pipeline
- 🧠 Skill demand

## 🔔 15. Notifications

Candidate notifications:

```text
Application received
Application shortlisted
Interview scheduled
Application rejected
New recommended job
```

Employer notifications:

```text
New application
New candidate
Interview response
Job deadline approaching
```

## 🔐 16. Security

Production requirements:

- 🔒 Password hashing
- 🔑 JWT/session authentication
- 🛡️ Role-based authorization
- ✅ Input validation
- 📄 File type validation
- 📦 File size limits
- 🔐 Secure resume storage
- 🏢 Protected employer APIs
- 👤 Protected candidate APIs
- 🔑 Environment variables for secrets

Never commit:

```text
.env
venv/
node_modules/
API keys
passwords
database credentials
private certificates
```

## 📌 Project Status

This README documents the **complete CareerPilot AI product across all 12 development phases**.  
The roadmap below represents the full implementation scope and final product architecture.

🟢 **DONE** — currently implemented and tested  
🟡 **IN PROGRESS** — currently being implemented  
⚪ **PLANNED** — part of the complete product roadmap

## 🗺️ 17. Complete Development Roadmap

### 🟢 Phase 1 — ATS Resume Checker

The public resume-analysis experience.

**Features:**
- 📄 PDF/DOCX resume upload
- 🎯 Target role
- 🧠 Focus skills
- 🤖 ATS scoring
- 📊 Resume quality scoring
- ✅ Matched skills
- ❌ Missing skills
- 🎓 Education matching
- 💼 Experience matching
- 🧠 Semantic analysis
- 💡 Improvement suggestions
- 🎯 Job description matching

**Status:** 🟢 DONE

---

### 🟡 Phase 2 — Job Seeker Account + Profile

Create the registered employee/job-seeker experience.

**Features:**
- 📝 Registration
- 🔐 Login
- 👤 Candidate profile
- 📧 Account information
- ⚙️ Profile settings
- 📄 Resume association
- 🧭 Job seeker dashboard

**Status:** 🟡 IN PROGRESS

---

### ⚪ Phase 3 — Resume Upload + Profile Extraction

Connect the job seeker's resume to their profile.

**Features:**
- 📄 Upload PDF/DOCX
- 🔄 Replace resume
- 📝 Parse resume
- 🧠 Extract skills
- 🎓 Extract education
- 💼 Extract experience
- 📊 Extract resume metadata
- 👤 Populate candidate profile automatically

**Status:** ⚪ PLANNED

---

### ⚪ Phase 4 — Employer Account + Dashboard

Create the employer/HR recruitment workspace.

**Features:**
- 🏢 Employer registration
- 🔐 Employer login
- 📊 Employer dashboard
- 💼 Active jobs
- 📩 Total applications
- 🆕 New applicants
- ⭐ Shortlisted candidates
- 🎤 Interviews
- 🎉 Hires
- 📈 Hiring pipeline
- ⚙️ Employer settings

**Status:** ⚪ PLANNED

---

### ⚪ Phase 5 — Employer Job Creation

Allow employers to create and manage recruitment jobs.

**Features:**
- ➕ Create job
- ✏️ Edit job
- 📢 Publish job
- 🔒 Close job
- 🗄️ Archive/delete job
- ⏰ Application deadline
- 🛠️ Required skills
- ⭐ Preferred skills
- 🎓 Education requirements
- 💼 Experience range
- 📍 Location
- 🏷️ Employment type
- 💰 Salary range
- 📝 Job description

**Status:** ⚪ PLANNED

---

### ⚪ Phase 6 — Active Job Listing + Deadline Logic

Ensure candidates only see valid opportunities.

**Features:**
- 🟢 ACTIVE jobs
- 🔴 CLOSED jobs
- ⏰ EXPIRED jobs
- 🔍 Job search
- 🎛️ Job filters
- 📅 Deadline validation
- 🚫 Hide expired jobs
- 🚫 Hide manually closed jobs

Only ACTIVE jobs should appear in:
- 💼 Recommended Jobs
- 🔎 All Jobs
- 🔍 Search Results

**Status:** ⚪ PLANNED

---

### ⚪ Phase 7 — Job Recommendations

Match job seekers with relevant active jobs.

**Ranking factors:**
- 🛠️ Skill match
- 🎯 Job-title relevance
- 🎓 Education match
- 💼 Experience match
- 🧠 Semantic relevance

**Example:**
```text
Python Developer        92%
Data Analyst            84%
ML Engineer             79%
Cybersecurity Engineer  31%
```

Expired and closed jobs are filtered before ranking.

**Status:** ⚪ PLANNED

---

### ⚪ Phase 8 — Candidate Applications

Complete the employee application workflow.

**Features:**
- 👀 View job details
- 📄 Select resume
- 📤 Apply
- 🚫 Prevent invalid/expired applications
- 📋 Application history
- 📊 Application status
- 🔄 Track status changes
- 🎤 View interview information

**Application statuses:**
```text
Applied
Under Review
Shortlisted
Interview
Selected
Rejected
Withdrawn
```

**Status:** ⚪ PLANNED

---

### ⚪ Phase 9 — Employer Applicant Management

Give HR a complete candidate-management workspace.

**Features:**
- 👥 View applicants
- 👤 Open candidate profile
- 📄 View resume
- 📊 View ATS analysis
- ✅ View matched skills
- ❌ View missing skills
- 🎓 View education
- 💼 View experience
- ⭐ Shortlist
- ❌ Reject
- 🎤 Move to interview
- 🎉 Mark hired
- 🔍 Search/filter applicants
- ↕️ Sort candidates

**Sorting options:**
- ATS score
- Match score
- Experience
- Application date
- Status

**Status:** ⚪ PLANNED

---

### ⚪ Phase 10 — AI Candidate Screening + Ranking

Automatically assist HR with candidate evaluation.

**Pipeline:**
```text
📋 Application
      ↓
📄 Resume Parsing
      ↓
🤖 ATS Analysis
      ↓
🎯 Candidate/Job Match
      ↓
🏆 Candidate Ranking
      ↓
⭐ HR Shortlist
```

**Candidate comparison includes:**
- ATS score
- Skill match
- Required skills
- Preferred skills
- Education match
- Experience match
- Resume quality
- Matched skills
- Missing skills
- Recommendation

**Important:** AI assists HR decision-making and does not automatically make irreversible hiring decisions.

**Status:** ⚪ PLANNED

---

### ⚪ Phase 11 — Interviews

Connect shortlisted candidates to the interview workflow.

**Features:**
- 🎤 Start interview
- 💻 Technical questions
- 👔 HR questions
- 🎯 Job-specific questions
- 👤 Candidate-specific questions
- 📊 Difficulty levels
- 🏆 Interview score
- 💬 Feedback
- 🕒 Interview history
- 📅 Interview information

**Existing APIs:**
```text
POST /api/interview/start
POST /api/interview/evaluate
```

**Status:** ⚪ PLANNED / API FOUNDATION AVAILABLE

---

### ⚪ Phase 12 — Analytics + Notifications

Complete the recruitment intelligence layer.

#### 📈 Employer Analytics

Show:
- 💼 Jobs Posted
- 📩 Applications
- 👥 Applicants Per Job
- 📊 Average ATS Score
- ⭐ Shortlist Rate
- 🎤 Interview Rate
- 🎉 Hiring Rate
- ❌ Rejected Candidates
- ⏱️ Time to Hire

**Charts:**
- 📈 Applications over time
- 🔽 Hiring funnel
- 💼 Job performance
- 👥 Candidate pipeline
- 🧠 Skill demand

#### 🔔 Candidate Notifications

- 📩 Application received
- ⭐ Application shortlisted
- 📅 Interview scheduled
- ❌ Application rejected
- 💼 New recommended job

#### 🔔 Employer Notifications

- 📩 New application
- 👤 New candidate
- 🎤 Interview response
- ⏰ Job deadline approaching

**Status:** ⚪ PLANNED

---

## 🏁 Complete Product Lifecycle

When all phases are implemented, CareerPilot AI will provide the complete recruitment loop:

```text
🚀 CAREERPILOT AI

👤 JOB SEEKER
    ↓
📝 Create Account
    ↓
📄 Upload Resume
    ↓
🧠 Extract Skills / Education / Experience
    ↓
👤 Build Profile
    ↓
💼 Active Job Recommendations
    ↓
🔎 Browse / Search Jobs
    ↓
📋 Apply
    ↓
📊 Track Application
    ↓
🎤 Interview
    ↓
🎉 Selected / ❌ Rejected


🏢 EMPLOYER / HR
    ↓
📝 Create Account
    ↓
💼 Create Job
    ↓
📢 Publish Job
    ↓
📩 Receive Applications
    ↓
📄 Review Resumes
    ↓
🤖 AI Screening
    ↓
🏆 Candidate Ranking
    ↓
⭐ Shortlist
    ↓
🎤 Interview
    ↓
🎉 Hire / ❌ Reject


📄 PUBLIC RESUME CHECKER
    ↓
📤 Upload Resume
    ↓
🤖 ATS Analysis
    ↓
📊 Score + Skill Analysis
    ↓
🎯 Job Match
    ↓
💡 Improvement Suggestions
```

## ✅ Final Phase Checklist

| Phase | Feature | Status |
|---|---|---|
| 1️⃣ | ATS Resume Checker | 🟢 DONE |
| 2️⃣ | Job Seeker Account + Profile | 🟡 IN PROGRESS |
| 3️⃣ | Resume Upload + Extraction | ⚪ PLANNED |
| 4️⃣ | Employer Account + Dashboard | ⚪ PLANNED |
| 5️⃣ | Employer Job Creation | ⚪ PLANNED |
| 6️⃣ | Active Jobs + Deadline Logic | ⚪ PLANNED |
| 7️⃣ | Job Recommendations | ⚪ PLANNED |
| 8️⃣ | Candidate Applications | ⚪ PLANNED |
| 9️⃣ | Applicant Management | ⚪ PLANNED |
| 🔟 | AI Screening + Ranking | ⚪ PLANNED |
| 1️⃣1️⃣ | Interviews | ⚪ PLANNED |
| 1️⃣2️⃣ | Analytics + Notifications | ⚪ PLANNED |

> 🎯 **Goal:** Complete all 12 phases to turn CareerPilot AI into a full end-to-end AI recruitment and career platform.

## ▶️ 18. Run Locally

### ⚙️ Backend

```powershell
cd C:\Users\jaima\Downloads\CareerPilot-AI\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### 💻 Frontend

```powershell
cd C:\Users\jaima\Downloads\CareerPilot-AI\frontend\frontend
npm run dev
```

### 🏭 Production Build Test

```powershell
npm run build
```

### 👀 Preview

```powershell
npm run preview
```

## 🎯 19. Final Goal

CareerPilot AI should provide the complete recruitment loop:

```text
Resume
  -> Candidate Profile
  -> Active Job Recommendation
  -> Application
  -> Employer Review
  -> AI Resume Screening
  -> Candidate Ranking
  -> Shortlist
  -> Interview
  -> Hire / Reject
```

At the same time, the public resume checker provides a standalone tool for anyone who wants to improve their resume and understand ATS compatibility.
