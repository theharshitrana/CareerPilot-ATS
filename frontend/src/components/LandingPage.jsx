export default function LandingPage({ onSelect }) {
  return (
    <div className="landing">
      <div className="landing-bg" />

      <header className="landing-top">
        <div className="brand-mark">CP</div>
        <div className="brand-name-wrap">
          <strong className="brand-name">CareerPilot AI</strong>
          <span className="brand-tag">AI recruitment intelligence</span>
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-hero">
          <span className="eyebrow">TWO-SIDED AI RECRUITMENT PLATFORM</span>
          <h1>
            Hire smarter. Get hired <span>faster.</span>
          </h1>
          <p>
            CareerPilot AI uses resume intelligence, semantic skill matching and
            ATS scoring to help employers screen better candidates and help
            candidates strengthen their resumes.
          </p>
        </div>

        <div className="landing-cards">
          <div className="role-card">
            <div className="role-card-head">
              <div className="role-icon e">E</div>
              <div>
                <span className="role-kicker">FOR EMPLOYERS</span>
                <h2>Employer</h2>
              </div>
            </div>
            <p className="role-text">Screen, rank and hire better candidates.</p>
            <ul className="role-features">
              <li>AI resume screening against any job</li>
              <li>ATS score, skill gaps and semantic analysis</li>
              <li>Candidate pipeline with status tracking</li>
            </ul>
            <div className="role-actions">
              <button className="btn btn-primary btn-block" onClick={() => onSelect("employer")}>
                Open Employer Dashboard
              </button>
            </div>
          </div>

          <div className="role-card">
            <div className="role-card-head">
              <div className="role-icon c">C</div>
              <div>
                <span className="role-kicker">FOR CANDIDATES</span>
                <h2>Candidate</h2>
              </div>
            </div>
            <p className="role-text">Analyze and improve your resume.</p>
            <ul className="role-features">
              <li>Free AI-powered ATS resume analysis</li>
              <li>Strengths, gaps and actionable suggestions</li>
              <li>Match your resume against real job descriptions</li>
            </ul>
            <div className="role-actions">
              <button className="btn btn-primary btn-block" onClick={() => onSelect("candidate")}>
                Analyze My Resume
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}