import { useState } from "react";
import { analyzeResume, splitList } from "../api";
import ResumeUpload from "./ResumeUpload";
import CandidateReport from "./CandidateReport";

// Candidate: paste a job description and match the uploaded resume.
export default function JobMatch({ onResult }) {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [required, setRequired] = useState("");
  const [preferred, setPreferred] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function run() {
    if (!file) {
      setError("Upload your resume first.");
      return;
    }
    if (!jobTitle.trim()) {
      setError("Enter a job title.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeResume({
        file,
        jobTitle: jobTitle.trim(),
        jobDescription: description,
        required: splitList(required),
        preferred: splitList(preferred),
        education: [],
        expMin: 0,
        expMax: null,
      });
      setResult(data);
      onResult && onResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="match-layout">
      <div className="panel match-form-panel">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">Match My Resume to a Job</h3>
            <p className="panel-sub">
              Paste a job description and get a real ATS match score from the
              engine.
            </p>
          </div>
        </div>
        <div className="panel-body">
          <ResumeUpload
            file={file}
            onSelect={setFile}
            onClear={() => setFile(null)}
            inputId="jobmatch-file"
            label="Upload your resume here"
          />

          <div className="form-field">
            <label className="form-label" htmlFor="jm-title">Job Title</label>
            <input
              id="jm-title"
              className="input"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Data Analyst"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="jm-desc">Paste Job Description</label>
            <textarea
              id="jm-desc"
              className="textarea large"
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the full job description here..."
            />
          </div>

          <div className="form-grid2">
            <div className="form-field">
              <label className="form-label" htmlFor="jm-req">Required Skills</label>
              <input
                id="jm-req"
                className="input"
                value={required}
                onChange={(e) => setRequired(e.target.value)}
                placeholder="Python, SQL, Excel"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="jm-pref">Preferred Skills</label>
              <input
                id="jm-pref"
                className="input"
                value={preferred}
                onChange={(e) => setPreferred(e.target.value)}
                placeholder="Tableau, Power BI"
              />
            </div>
          </div>

          {error ? <div className="form-error">{error}</div> : null}

          <button
            className="btn btn-primary btn-large btn-block"
            onClick={run}
            disabled={loading}
          >
            {loading ? "Analyzing job match..." : "Analyze Job Match"}
          </button>
        </div>
      </div>

      <div className="panel match-result-panel">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">Job Match Result</h3>
            <p className="panel-sub">Live analysis from the ATS engine.</p>
          </div>
        </div>
        {result ? (
          <CandidateReport result={result} label="My Resume" />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">J</div>
            <h3>No match yet</h3>
            <p>
              Upload your resume, paste a job description and run the analysis
              to see your match score, skill gaps and recommendation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}