import { useState } from "react";
import "../App.css";
import Header from "./Header";
import ResumeUpload from "./ResumeUpload";
import CandidateReport from "./CandidateReport";
import JobMatch from "./JobMatch";
import { analyzeResume, clampScore, splitList } from "../api";

const NAV_ITEMS = [
  { id: "analyzer", label: "Resume Analyzer" },
  { id: "jobmatch", label: "Job Match" },
  { id: "resume", label: "My Resume" },
  { id: "suggestions", label: "Suggestions" },
];

function AnalyzerView({ onResult, lastResult, setLastResult }) {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [required, setRequired] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(lastResult);

  async function run() {
    if (!file) {
      setError("Upload your resume first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await analyzeResume({
        file,
        jobTitle: targetRole.trim() || "General Profile Analysis",
        jobDescription: "",
        required: splitList(required),
        preferred: [],
        education: [],
        expMin: 0,
        expMax: null,
      });

      setResult(data);
      setLastResult(data);
      onResult && onResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <section className="cand-hero">
        <div>
          <span className="eyebrow">YOUR CAREER CO-PILOT</span>
          <h1>Know how strong your resume really is.</h1>
          <p>
            Upload your resume and get an AI-powered ATS analysis with real
            scores from the CareerPilot engine.
          </p>
        </div>

        <div className="cand-hero-chip">
          <span className="ai-dot" />
          Free AI analysis
        </div>
      </section>

      <div className="workspace-grid">
        <div className="panel screening-panel">
          <div className="panel-head">
            <div>
              <h3 className="panel-title">Resume Analyzer</h3>
              <p className="panel-sub">
                No signup needed. Your resume is analyzed in seconds.
              </p>
            </div>

            {loading ? (
              <span className="save-toast">AI analyzing...</span>
            ) : null}
          </div>

          <div className="panel-body">
            <ResumeUpload
              file={file}
              onSelect={setFile}
              onClear={() => setFile(null)}
              inputId="candidate-upload"
            />

            <div className="form-grid2">
              <div className="form-field">
                <label className="form-label" htmlFor="cad-role">
                  Target role <em>optional</em>
                </label>

                <input
                  id="cad-role"
                  className="input"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Data Analyst"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cad-skills">
                  Focus skills <em>optional</em>
                </label>

                <input
                  id="cad-skills"
                  className="input"
                  value={required}
                  onChange={(e) => setRequired(e.target.value)}
                  placeholder="SQL, Python, Excel"
                />
              </div>
            </div>

            {error ? <div className="form-error">{error}</div> : null}

            <button
              className="btn btn-primary btn-large btn-block"
              onClick={run}
              disabled={loading}
            >
              {loading ? "Analyzing My Resume..." : "Analyze My Resume"}
            </button>
          </div>
        </div>

        <div className="panel intelligence-panel">
          <div className="panel-head">
            <div>
              <h3 className="panel-title">Your ATS Report</h3>
              <p className="panel-sub">
                Scores, skill coverage and resume quality - computed live.
              </p>
            </div>
          </div>

          {result ? (
            <CandidateReport result={result} label="My Resume" />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">AI</div>
              <h3>No analysis yet</h3>
              <p>
                Upload your resume and run "Analyze My Resume" to see your ATS
                score, resume quality, skills coverage, education and
                experience.
              </p>

              <div className="empty-features">
                <span>ATS Score</span>
                <span>Resume Quality</span>
                <span>Skill Coverage</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MyResumeView({ lastResult }) {
  if (!lastResult) {
    return (
      <div className="panel">
        <div className="empty-state">
          <div className="empty-icon">R</div>
          <h3>No resume analyzed yet</h3>
          <p>
            Run the Resume Analyzer first and your resume summary will appear
            here.
          </p>
        </div>
      </div>
    );
  }

  const detected = lastResult.detected_skills || [];
  const sections = lastResult.resume_sections || [];
  const scores = lastResult.scores || {};
  const filename = lastResult.candidate?.filename || "";
  const wordCount = lastResult.candidate?.word_count;
  const quality = clampScore(scores.resume_quality_score);

  return (
    <div className="resume-summary">
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">My Resume</h3>
            <p className="panel-sub">
              A snapshot of the last analyzed resume.
            </p>
          </div>
        </div>

        <div className="panel-body">
          <div className="resume-meta">
            <div className="resume-file-icon">R</div>

            <div>
              <strong>{filename || "Resume"}</strong>
              <span>
                {typeof wordCount === "number"
                  ? wordCount + " words"
                  : ""}
              </span>
            </div>
          </div>

          <div className="resume-quality">
            <div className="resume-quality-top">
              <span>Resume Quality</span>

              <b
                className={
                  quality >= 70
                    ? "ok"
                    : quality >= 55
                      ? "mid"
                      : "bad"
                }
              >
                {quality}%
              </b>
            </div>

            <div className="progress">
              <i
                className={
                  quality >= 70
                    ? "good"
                    : quality >= 55
                      ? "mid"
                      : "low"
                }
                style={{ width: quality + "%" }}
              />
            </div>
          </div>

          {sections.length > 0 ? (
            <div className="sec-blocks">
              <h5>Detected Sections</h5>

              <div className="chips">
                {sections.map((s) => (
                  <span className="chip info" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {detected.length > 0 ? (
            <div className="sec-blocks">
              <h5>Detected Skills ({detected.length})</h5>

              <div className="chips">
                {detected.slice(0, 18).map((s) => (
                  <span className="chip match" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SuggestionsView({ lastResult }) {
  if (!lastResult) {
    return (
      <div className="panel">
        <div className="empty-state">
          <div className="empty-icon">S</div>
          <h3>No suggestions yet</h3>
          <p>
            Analyze your resume to generate personalized AI suggestions based
            on the real analysis.
          </p>
        </div>
      </div>
    );
  }

  const improvements = lastResult.improvement_recommendations || [];
  const requiredKw = lastResult.required_keywords || {};
  const missing = requiredKw.missing || [];
  const preferKw = lastResult.preferred_keywords || {};
  const prefMissing = preferKw.missing || [];
  const score = clampScore(lastResult.ats_score);

  const grouped = [];

  if (improvements.length > 0) {
    grouped.push({
      title: "AI Suggestions",
      items: improvements,
    });
  }

  if (missing.length > 0) {
    grouped.push({
      title: "Close these skill gaps",
      items: missing.map(
        (s) => "Add " + s + " to your resume if you have used it."
      ),
    });
  }

  if (prefMissing.length > 0) {
    grouped.push({
      title: "Preferred skills worth adding",
      items: prefMissing.map(
        (s) => "Mention " + s + " if relevant to your target role."
      ),
    });
  }

  if (score < 70) {
    grouped.push({
      title: "Overall",
      items: [
        "Quantify achievements with numbers to raise impact.",
        "Keep sections clearly labelled: Summary, Experience, Education, Skills.",
        "Mirror the keywords used in the job description you apply to.",
      ],
    });
  }

  return (
    <div className="suggestions-grid">
      {grouped.map((group) => (
        <div className="panel suggestion-group" key={group.title}>
          <div className="panel-head">
            <div>
              <h3 className="panel-title">{group.title}</h3>
              <p className="panel-sub">Based on your latest analysis.</p>
            </div>
          </div>

          <div className="panel-body">
            <ul className="suggestion-list">
              {group.items.map((item, i) => (
                <li key={item}>
                  <span className="sug-num">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {grouped.length === 0 ? (
        <div className="panel">
          <div className="empty-state">
            <h3>Your resume looks well aligned</h3>
            <p>No obvious improvement areas were detected.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function CandidateDashboard({ onBack }) {
  const [view, setView] = useState("analyzer");
  const [lastResult, setLastResult] = useState(null);

  return (
    <div className="cand-shell">
      <Header
        variant="candidate"
        onBack={onBack}
        title="Candidate Workspace"
      />

      <nav className="cand-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={view === item.id ? "active" : ""}
            onClick={() => setView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="cand-content">
        {view === "analyzer" ? (
          <AnalyzerView
            lastResult={lastResult}
            setLastResult={setLastResult}
          />
        ) : null}

        {view === "jobmatch" ? (
          <JobMatch onResult={setLastResult} />
        ) : null}

        {view === "resume" ? (
          <MyResumeView lastResult={lastResult} />
        ) : null}

        {view === "suggestions" ? (
          <SuggestionsView lastResult={lastResult} />
        ) : null}
      </main>
    </div>
  );
}
