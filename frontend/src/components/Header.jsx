// Top header. Employer variant has search + AI online + profile;
// candidate variant is a compact top bar.
export default function Header({ variant, onBack, title }) {
  if (variant === "candidate") {
    return (
      <header className="cand-topbar">
        <button className="back-link" onClick={onBack}>
          &lt; Home
        </button>
        <strong className="cand-title">{title || "Candidate Workspace"}</strong>
        <div className="ai-online">
          <span className="ai-dot" />
          AI Engine Online
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-search">
        <span className="search-glyph" aria-hidden="true">Q</span>
        <input
          type="text"
          placeholder="Search candidates, jobs, or keywords"
        />
        <kbd>Ctrl K</kbd>
      </div>

      <div className="header-actions">
        <div className="ai-online">
          <span className="ai-dot" />
          AI Engine Online
        </div>
        <button className="notif-btn" type="button">
          <span aria-hidden="true">!</span>
          <b className="notif-badge">3</b>
        </button>
        <div className="header-divider" />
        <div className="profile">
          <div className="profile-avatar">HR</div>
          <div className="profile-meta">
            <strong className="profile-name">Harsh</strong>
            <span className="profile-role">HR Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}