import { clampScore, scoreTone } from "../api";

export default function SkillMatch({ name, value }) {
  const v = clampScore(value);
  return (
    <div className="skill-match">
      <div className="skill-match-top">
        <span className="skill-dot" />
        <span className="skill-name">{name}</span>
        <b className={scoreTone(v)}>{v}%</b>
      </div>
      <div className="progress thin">
        <i className={scoreTone(v)} style={{ width: v + "%" }} />
      </div>
    </div>
  );
}