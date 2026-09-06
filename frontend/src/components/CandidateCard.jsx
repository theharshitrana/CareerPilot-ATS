import { clampScore, scoreTone } from "../api";

const STATUS_CLASS = {
  New: "info",
  Shortlisted: "good",
  Interview: "mid",
  Rejected: "bad",
  Hired: "good",
  Pending: "info",
};

// A candidate row used inside the candidates table list.
export default function CandidateCard({ candidate, onView, onChangeStatus }) {
  const score = clampScore(candidate.score);
  const tone = scoreTone(score);
  const result = candidate.result || {};
  const scores = result.scores || {};
  const skillMatch = clampScore(scores.skill_coverage);
  const expYears = result.experience && result.experience.candidate_experience_years;
  const eduMatched = (result.education && result.education.matched) || [];
  const statusClass = STATUS_CLASS[candidate.status] || "info";

  return (
    <tr className="candidate-row">
      <td>
        <div className="cand-cell">
          <div className="cand-avatar">{candidate.name.charAt(0).toUpperCase()}</div>
          <div>
            <strong className="cand-name">{candidate.name}</strong>
            <span className="cand-file">{candidate.file || ""}</span>
          </div>
        </div>
      </td>
      <td>
        <span className={"score-pill " + tone}>{score}</span>
      </td>
      <td>
        <div className="cell-progress">
          <div className="progress thin">
            <i className={scoreTone(skillMatch)} style={{ width: skillMatch + "%" }} />
          </div>
          <span>{skillMatch}%</span>
        </div>
      </td>
      <td className="cell-muted">
        {typeof expYears === "number" ? expYears + " yrs" : "-"}
      </td>
      <td className="cell-muted">
        {eduMatched.length ? eduMatched.join(", ") : "-"}
      </td>
      <td>
        <span className={"status-pill " + statusClass}>{candidate.status}</span>
      </td>
      <td>
        <div className="row-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => onView(candidate)}>
            View
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onChangeStatus(candidate.id, "Shortlisted")}
          >
            Shortlist
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onChangeStatus(candidate.id, "Interview")}
          >
            Interview
          </button>
          <button
            className="btn btn-ghost btn-sm btn-danger"
            onClick={() => onChangeStatus(candidate.id, "Rejected")}
          >
            Reject
          </button>
        </div>
      </td>
    </tr>
  );
}