// Employer sidebar navigation with groups.
export default function Sidebar({ groups, active, onNav, onHome }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">CP</div>
        <div className="brand-name-wrap">
          <strong className="brand-name">CareerPilot AI</strong>
          <span className="brand-tag">HR workspace</span>
        </div>
      </div>

      <div className="sidebar-nav">
        {groups.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-label">{group.label}</div>
            {group.items.map((item) => (
              <button
                key={item.id}
                className={"nav-item" + (active === item.id ? " active" : "")}
                onClick={() => onNav(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <button className="back-home" onClick={onHome}>
          <span className="nav-icon">&lt;</span>
          <span className="nav-text">Back to home</span>
        </button>
        <div className="upgrade-card">
          <div className="upgrade-icon">+</div>
          <div className="upgrade-text">
            <strong>Upgrade to Pro</strong>
            <p>Unlock advanced AI insights and bulk screening.</p>
          </div>
          <button className="upgrade-btn">Upgrade</button>
        </div>
      </div>
    </aside>
  );
}