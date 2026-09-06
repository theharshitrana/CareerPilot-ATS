import { clampScore, scoreTone } from "../api";

export default function ScoreCard({ label, value, hint }) {
  const v = clampScore(value);
  const tone = scoreTone(v);
  return (
    <div className="score-card">
      <div className="score-card-top">
        <span>{label}</span>
        <b>{v}%</b>
      </div>
      <div className="progress">
        <i className={tone} style={{ width: v + "%" }} />
      </div>
      {hint ? <small className="score-card-hint">{hint}</small> : null}
    </div>
  );
}