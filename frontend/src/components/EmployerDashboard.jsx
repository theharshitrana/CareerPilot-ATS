import { useState } from "react";
import Layout from "./Layout";
import ResumeUpload from "./ResumeUpload";
import CandidateReport from "./CandidateReport";
import CandidateList from "./CandidateList";
import JobForm from "./JobForm";
import KpiCard from "./KpiCard";
import { analyzeResume, candidateNameFromFile, splitList } from "../api";

const NAV_GROUPS = [
  {
    label: "WORKSPACE",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "D" },
      { id: "screening", label: "Resume Screening", icon: "R" },
      { id: "candidates", label: "Candidates", icon: "C" },
      { id: "jobs", label: "Jobs", icon: "J" },
      { id: "interviews", label: "Interviews", icon: "I" },
      { id: "analytics", label: "Analytics", icon: "A" },
      { id: "reports", label: "Saved Reports", icon: "R" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { id: "settings", label: "Settings", icon: "G" },
      { id: "help", label: "Help & Support", icon: "?" },
    ],
  },
];

// Shared screening workspace used on the Dashboard and Screening views.
function ScreeningWorkspace({ onAnalyzed }) {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [jobDescription, setJobDescription] = useState(
    "Looking for a software engineer with strong programming, backend development, APIs, databases and problem solving skills."
  );
  const [skills, setSkills] = useState([
    "Python",
    "Java",
    "SQL",
    "REST API",
    "Data Structures",
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [preferred, setPreferred] = useState("React, Docker, AWS, Git");
  const [education, setEducation] = useState("B.Tech");
  const [expMin, setExpMin] = useState("0");
  const [expMax, setExpMax] = useState("2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function removeSkill(skill) {
    setSkills(skills.filter((s) => s !== skill));
  }

  function addSkill() {
    const value = skillInput.trim();
    if (!value) return;
    if (!skills.includes(value)) setSkills([...skills, value]);
    setSkillInput("");
  }
async function analyze() {
    if (!file) {
      setError("Upload a resume first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeResume({
        file,
        jobTitle,
        jobDescription,
        required: skills,
        preferred: splitList(preferred),
        education: splitList(education),
        expMin: parseInt(expMin || "0", 10) || 0,
        expMax: expMax === "" ? null : parseInt(expMax, 10) || null,
      });
      setResult(data);
      onAnalyzed &&
        onAnalyzed({
          id: Date.now(),
          name: candidateNameFromFile(file),
          file: file.name,
          score: data.ats_score ?? 0,
          result: data,
          status: "New",
        });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="workspace-grid">
      <div className="panel screening-panel">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">Analyze a Candidate</h3>
            <p className="panel-sub">
              Upload a resume and configure the job to screen against.
            </p>
          </div>
          {loading ? <span className="save-toast">AI analyzing...</span> : null}
        </div>
        <div className="panel-body">
          <ResumeUpload
            file={file}
            onSelect={setFile}
            onClear={() => setFile(null)}
            inputId="employer-upload"
          />
<div className="form-grid2">
            <div className="form-field">
              <label className="form-label" htmlFor="emp-title">Job Title</label>
              <input
                id="emp-title"
                className="input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="emp-edu">Education</label>
              <input
                id="emp-edu"
                className="input"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="emp-desc">Job Description</label>
            <textarea
              id="emp-desc"
              className="textarea"
              rows="4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="emp-req">Required Skills</label>
            <div className="skills-box">
              {skills.map((s) => (
                <span className="skill-chip" key={s}>
                  {s}
                  <button type="button" onClick={() => removeSkill(s)}>
                    x
                  </button>
                </span>
              ))}
              <input
                className="skill-input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add a skill and press Enter"
              />
            </div>
          </div>
<div className="form-grid2">
            <div className="form-field">
              <label className="form-label" htmlFor="emp-pref">Preferred Skills</label>
              <input
                id="emp-pref"
                className="input"
                value={preferred}
                onChange={(e) => setPreferred(e.target.value)}
              />
            </div>
            <div className="inline-fields">
              <div className="form-field">
                <label className="form-label" htmlFor="emp-min">Exp. Min</label>
                <input
                  id="emp-min"
                  className="input"
                  type="number"
                  min="0"
                  value={expMin}
                  onChange={(e) => setExpMin(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="emp-max">Exp. Max</label>
                <input
                  id="emp-max"
                  className="input"
                  type="number"
                  min="0"
                  value={expMax}
                  onChange={(e) => setExpMax(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error ? <div className="form-error">{error}</div> : null}

          <button
            className="btn btn-primary btn-large btn-block analyze-btn"
            onClick={analyze}
            disabled={loading}
          >
            {loading ? "Analyzing Candidate..." : "Analyze Candidate"}
          </button>
        </div>
      </div>

      <div className="panel intelligence-panel">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">Candidate Intelligence</h3>
            <p className="panel-sub">
              Live ATS report from the backend.
            </p>
          </div>
        </div>
        {result ? (
          <CandidateReport result={result} label={candidateNameFromFile(file)} />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">AI</div>
            <h3>Screen a resume to see intelligence</h3>
            <p>
              Upload a resume, configure the job and run "Analyze Candidate" to
              see the full AI report here.
            </p>
            <div className="empty-features">
              <span>01 ATS Match</span>
              <span>02 Skills</span>
              <span>03 Education</span>
              <span>04 Experience</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default function EmployerDashboard({ onBack }) {
  const [view, setView] = useState("dashboard");
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);

  function addCandidate(candidate) {
    setCandidates((prev) => [candidate, ...prev]);
    setSelected(candidate);
  }

  function changeStatus(id, status) {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  }

  function addJob(job) {
    setJobs((prev) => [job, ...prev]);
  }

  const kpis = [
    { icon: "U", label: "Total Candidates", value: 248, delta: "+12%", up: true },
    { icon: "J", label: "Jobs Posted", value: 12, delta: "+20%", up: true },
    { icon: "R", label: "Resumes Screened", value: 186, delta: "+18%", up: true },
    { icon: "H", label: "Successful Hires", value: 9, delta: "+50%", up: true },
  ];

  function renderDashboard() {
    return (
      <div>
        <section className="hero-banner">
          <div className="hero-copy">
            <span className="eyebrow">SMARTER HIRING</span>
            <h1 className="hero-title">
              Find the right talent with
              <span className="hero-highlight"> AI-powered insights.</span>
            </h1>
            <p className="hero-sub">
              Screen resumes, match skills, and get detailed candidate analysis
              in seconds.
            </p>
            <div className="hero-actions">
              <button
                className="btn btn-primary"
                onClick={() => setView("screening")}
              >
                Screen a Resume
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setView("candidates")}
              >
                View Candidates
              </button>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-doc">
              <div className="hero-doc-head">
                <span className="hero-avatar">S</span>
                <i />
                <i />
                <span className="hero-badge">92%</span>
              </div>
              <div className="hero-bar wide" />
              <div className="hero-bar" />
              <div className="hero-bar short" />
              <div className="hero-bar" />
            </div>
            <span className="hero-tag t1">Skills Match</span>
            <span className="hero-tag t2">Experience</span>
            <span className="hero-tag t3">Education</span>
          </div>
        </section>

        <section className="kpi-grid">
          {kpis.map((k) => (
            <KpiCard
              key={k.label}
              icon={k.icon}
              label={k.label}
              value={k.value}
              delta={k.delta}
              deltaUp={k.up}
            />
          ))}
        </section>

        <div className="section-header">
          <div>
            <h2 className="section-title">Screening Workspace</h2>
            <p className="section-sub">
              Upload, configure and analyze candidates in one place.
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setView("screening")}>
            Open full screening
          </button>
        </div>

        <ScreeningWorkspace onAnalyzed={addCandidate} />
      </div>
    );
  }
function renderScreening() {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1 className="page-title">Resume Screening</h1>
            <p className="page-sub">
              Screen any resume against your job requirements with the AI engine.
            </p>
          </div>
        </div>
        <ScreeningWorkspace onAnalyzed={addCandidate} />
      </div>
    );
  }

  function renderCandidates() {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1 className="page-title">Candidates</h1>
            <p className="page-sub">
              Everyone screened with CareerPilot AI. Actions update local
              status only.
            </p>
          </div>
        </div>

        {selected ? (
          <div className="selected-report">
            <div className="selected-head">
              <div className="selected-person">
                <div className="cand-avatar">{selected.name.charAt(0).toUpperCase()}</div>
                <div>
                  <h3>{selected.name}</h3>
                  <span className="status-pill info">{selected.status}</span>
                </div>
              </div>
              <div className="selected-actions">
                {["Shortlisted", "Interview", "Hired", "Rejected"].map((s) => (
                  <button
                    key={s}
                    className="btn btn-ghost btn-sm"
                    onClick={() => changeStatus(selected.id, s)}
                  >
                    {s}
                  </button>
                ))}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSelected(null)}
                >
                  Close report
                </button>
              </div>
            </div>
            <CandidateReport result={selected.result} label={selected.name} />
          </div>
        ) : (
          <CandidateList
            candidates={candidates}
            onView={(c) => setSelected(c)}
            onChangeStatus={changeStatus}
          />
        )}
      </div>
    );
  }

  function renderJobs() {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1 className="page-title">Jobs</h1>
            <p className="page-sub">
              Define roles once and reuse them for screening.
            </p>
          </div>
        </div>
        <div className="jobs-layout">
          <JobForm onSave={addJob} />
          <div className="jobs-list">
            {jobs.length === 0 ? (
              <div className="panel">
                <div className="empty-state">
                  <div className="empty-icon">J</div>
                  <h3>No jobs created yet</h3>
                  <p>Use the form to create your first job requirement.</p>
                </div>
              </div>
            ) : (
              jobs.map((job) => (
                <div className="job-card" key={job.id}>
                  <div className="job-card-top">
                    <h4>{job.title}</h4>
                    <span className="job-meta">
                      {job.expMin}-{job.expMax || "no max"} yrs
                    </span>
                  </div>
                  <p className="job-desc">{job.description}</p>
                  <div className="job-tags">
                    {job.required.slice(0, 6).map((s) => (
                      <span className="chip match" key={s}>{s}</span>
                    ))}
                    {job.preferred.slice(0, 4).map((s) => (
                      <span className="chip info" key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
function renderInterviews() {
    const rows = [
      { name: "Aarav Sharma", role: "Software Engineer", when: "Today, 2:30 PM", status: "Scheduled" },
      { name: "Priya Patel", role: "Data Analyst", when: "Today, 4:00 PM", status: "Scheduled" },
      { name: "Rohan Mehta", role: "Frontend Developer", when: "Tomorrow, 11:00 AM", status: "Pending" },
      { name: "Sneha Iyer", role: "DevOps Engineer", when: "Tomorrow, 3:30 PM", status: "Pending" },
    ];
    return (
      <div>
        <div className="page-head">
          <div>
            <h1 className="page-title">Interviews</h1>
            <p className="page-sub">Upcoming interview schedule for your team.</p>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3 className="panel-title">Upcoming interviews</h3>
              <p className="panel-sub">Demo calendar data.</p>
            </div>
          </div>
          <div className="interview-list">
            {rows.map((row) => (
              <div className="interview-row" key={row.name}>
                <div className="interview-avatar">{row.name.charAt(0)}</div>
                <div className="interview-info">
                  <strong>{row.name}</strong>
                  <span>{row.role}</span>
                </div>
                <span className="interview-when">{row.when}</span>
                <span className={"status-pill " + (row.status === "Scheduled" ? "good" : "info")}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderAnalytics() {
    const bars = [
      { label: "Candidates", v: 82 },
      { label: "Shortlisted", v: 55 },
      { label: "Interviews", v: 38 },
      { label: "Offers", v: 24 },
      { label: "Hires", v: 18 },
    ];
    return (
      <div>
        <div className="page-head">
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="page-sub">Funnel performance across your pipeline.</p>
          </div>
        </div>
        <div className="analytics-grid">
          <div className="panel">
            <div className="panel-head">
              <div>
                <h3 className="panel-title">Pipeline funnel</h3>
                <p className="panel-sub">Demo numbers for visual reference.</p>
              </div>
            </div>
            <div className="funnel-bars">
              {bars.map((b) => (
                <div className="funnel-row" key={b.label}>
                  <span>{b.label}</span>
                  <div className="funnel-track">
                    <i style={{ width: b.v + "%" }} />
                  </div>
                  <b>{b.v}</b>
                </div>
              ))}
            </div>
          </div>
          <div className="analytics-side">
            {[
              { label: "Time to screen", value: "1.4 days" },
              { label: "Interview pass rate", value: "64%" },
              { label: "Offer acceptance", value: "78%" },
              { label: "Avg. funnel dropoff", value: "38%" },
            ].map((s) => (
              <div className="mini-stat" key={s.label}>
                <span>{s.label}</span>
                <strong>{s.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderReports() {
    const reports = [
      { title: "Q3 hiring pipeline summary", date: "Sep 02, 2026", type: "Pipeline" },
      { title: "Skill gap analysis - Engineering", date: "Aug 28, 2026", type: "Skills" },
      { title: "Weekly screening throughput", date: "Aug 25, 2026", type: "Screening" },
      { title: "Source effectiveness report", date: "Aug 18, 2026", type: "Sourcing" },
    ];
    return (
      <div>
        <div className="page-head">
          <div>
            <h1 className="page-title">Saved Reports</h1>
            <p className="page-sub">Auto-generated reports saved by your team.</p>
          </div>
        </div>
        <div className="reports-grid">
          {reports.map((r) => (
            <div className="panel report-row" key={r.title}>
              <div className="report-row-type">{r.type}</div>
              <div>
                <h4>{r.title}</h4>
                <span className="muted-text">{r.date}</span>
              </div>
              <button className="btn btn-ghost btn-sm">Open</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
function renderSettings() {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-sub">Workspace preferences (demo).</p>
          </div>
        </div>
        <div className="panel settings-panel">
          <div className="form-grid2">
            <div className="form-field">
              <label className="form-label" htmlFor="s-org">Organization name</label>
              <input id="s-org" className="input" defaultValue="Nexus Talent Pvt Ltd" />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="s-email">Default screening email</label>
              <input id="s-email" className="input" defaultValue="talent@nexus.example" />
            </div>
          </div>
          <div className="settings-switch">
            <div>
              <strong>Auto-rank applicants</strong>
              <span>Rank candidates automatically by ATS score.</span>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="switch-slider" />
            </label>
          </div>
          <div className="settings-switch">
            <div>
              <strong>Weekly screening digest</strong>
              <span>Email a summary of screened candidates every week.</span>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="switch-slider" />
            </label>
          </div>
        </div>
      </div>
    );
  }

  function renderHelp() {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1 className="page-title">Help &amp; Support</h1>
            <p className="page-sub">Common questions and support links.</p>
          </div>
        </div>
        <div className="panel">
          <div className="panel-body">
            <div className="help-faq">
              {[
                ["How does screening work?", "Upload a PDF or DOCX resume, set the job requirements, then run Analyze Candidate. The backend returns a real ATS score, skill matches, education and experience analysis."],
                ["Which files are supported?", "Only PDF and DOCX resumes are accepted by the backend."],
                ["Is the ATS score real?", "Yes. The score is computed by the FastAPI backend using keyword, semantic and section analysis - it is never faked on the frontend."],
              ].map(([q, a]) => (
                <div className="faq-item" key={q}>
                  <strong>{q}</strong>
                  <p>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const views = {
    dashboard: renderDashboard,
    screening: renderScreening,
    candidates: renderCandidates,
    jobs: renderJobs,
    interviews: renderInterviews,
    analytics: renderAnalytics,
    reports: renderReports,
    settings: renderSettings,
    help: renderHelp,
  };

  return (
    <Layout
      groups={NAV_GROUPS}
      active={view}
      onNav={setView}
      onHome={onBack}
    >
      {views[view] ? views[view]() : renderDashboard()}
    </Layout>
  );
}