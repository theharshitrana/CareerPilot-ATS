import CandidateCard from "./CandidateCard";

// Professional candidate table. Status changes are local state only.
export default function CandidateList({ candidates, onView, onChangeStatus }) {
  if (!candidates.length) {
    return (
      <div className="panel">
        <div className="empty-state">
          <div className="empty-icon">C</div>
          <h3>No candidates yet</h3>
          <p>
            Screen a resume from the Resume Screening view and analyzed
            candidates will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel table-panel">
      <div className="panel-head">
        <div>
          <h3 className="panel-title">Candidate Pipeline</h3>
          <p className="panel-sub">
            {candidates.length} candidate(s) screened. Actions update local
            status only.
          </p>
        </div>
      </div>
      <div className="table-wrap">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>ATS Score</th>
              <th>Skills Match</th>
              <th>Experience</th>
              <th>Education</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <CandidateCard
                key={c.id}
                candidate={c}
                onView={onView}
                onChangeStatus={onChangeStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}