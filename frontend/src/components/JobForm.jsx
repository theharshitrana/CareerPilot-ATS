import { useState } from "react";
import { splitList } from "../api";

// Job creation form used on the Jobs view.
export default function JobForm({ onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [required, setRequired] = useState("");
  const [preferred, setPreferred] = useState("");
  const [education, setEducation] = useState("");
  const [expMin, setExpMin] = useState("0");
  const [expMax, setExpMax] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Job title is required.");
      return;
    }
    const job = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim() || "No description provided.",
      required: splitList(required),
      preferred: splitList(preferred),
      education: splitList(education) || ["B.Tech"],
      expMin: parseInt(expMin || "0", 10) || 0,
      expMax: expMax === "" ? null : parseInt(expMax, 10) || null,
      createdAt: new Date().toISOString(),
    };
    setError("");
    setSaved(true);
    onSave && onSave(job);
    window.setTimeout(() => setSaved(false), 4000);
  }

  return (
    <form className="panel job-form" onSubmit={submit}>
      <div className="panel-head">
        <div>
          <h3 className="panel-title">Create Job Requirement</h3>
          <p className="panel-sub">
            Define the role - this powers ATS screening and matching.
          </p>
        </div>
        {saved ? <span className="save-toast">Job created</span> : null}
      </div>

      <div className="panel-body">
        <div className="form-field">
          <label className="form-label" htmlFor="job-title">Job Title</label>
          <input
            id="job-title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="job-desc">Job Description</label>
          <textarea
            id="job-desc"
            className="textarea"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Primary responsibilities, day to day work, team context..."
          />
        </div>

        <div className="form-grid2">
          <div className="form-field">
            <label className="form-label" htmlFor="job-req">Required Skills <em>comma separated</em></label>
            <input
              id="job-req"
              className="input"
              value={required}
              onChange={(e) => setRequired(e.target.value)}
              placeholder="Python, SQL, REST API"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="job-pref">Preferred Skills <em>comma separated</em></label>
            <input
              id="job-pref"
              className="input"
              value={preferred}
              onChange={(e) => setPreferred(e.target.value)}
              placeholder="Docker, AWS, Git"
            />
          </div>
        </div>

        <div className="form-grid3">
          <div className="form-field">
            <label className="form-label" htmlFor="job-edu">Education</label>
            <input
              id="job-edu"
              className="input"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="B.Tech, M.Tech"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="job-exmin">Minimum Experience</label>
            <input
              id="job-exmin"
              className="input"
              type="number"
              min="0"
              value={expMin}
              onChange={(e) => setExpMin(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="job-exmax">Maximum Experience</label>
            <input
              id="job-exmax"
              className="input"
              type="number"
              min="0"
              value={expMax}
              onChange={(e) => setExpMax(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        {error ? <div className="form-error">{error}</div> : null}

        <div className="form-submit">
          <button className="btn btn-primary" type="submit">
            Create Job
          </button>
        </div>
      </div>
    </form>
  );
}