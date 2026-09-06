export default function KpiCard({ icon, label, value, delta, deltaUp = true }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-body">
        <span className="kpi-label">{label}</span>
        <strong className="kpi-value">{value}</strong>
      </div>
      <div className={"kpi-delta " + (deltaUp ? "up" : "down")}>{delta}</div>
    </div>
  );
}