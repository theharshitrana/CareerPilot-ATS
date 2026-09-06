import { clampScore, scoreTone, fileBase } from "../api";
import ScoreCard from "./ScoreCard";
import SkillMatch from "./SkillMatch";

function Section({ title, children }) {
  return (
    <div className="report-section">
      <h4 className="report-section-title">{title}</h4>
      {children}
    </div>
  );
}

function Chip({ type, children }) {
  return <span className={"chip " + type}>{children}</span>;
}

// Full ATS report rendered from a real backend response.
export default function CandidateReport({ result, label }) {
  if (!result) return null;

  const score = clampScore(result.ats_score ?? result.score);
  const tone = scoreTone(score);
  const scores = result.scores || {};
  const requiredKw = result.required_keywords || {};
  const preferKw = result.preferred_keywords || {};
  const edu = result.education || {};
  const exp = result.experience || {};
  const detected = result.detected_skills || [];
  const improvements = result.improvement_recommendations || [];
  const semantic = requiredKw.semantic_analysis || [];

  const matched = requiredKw.matched || [];
  const missing = requiredKw.missing || [];
  const prefMatched = preferKw.matched || [];
  const prefMissing = preferKw.missing || [];
  const eduMatched = edu.matched || [];
  const eduMissing = edu.missing || [];

  const fileName = result.candidate?.filename || "";
  const displayName =
    label || fileBase(fileName).replace(/[-_]+/g, " ") || "Candidate";
  const wordCount = result.candidate?.word_count;

  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const strengths = [];
  if (matched.length > 0) {
    strengths.push("Strong match for " + matched.slice(0, 5).join(", "));
  }
  if (detected.length > 0) {
    strengths.push(
      "Detected " + detected.length + " skills: " + detected.slice(0, 8).join(", ")
    );
  }
  if (typeof exp.candidate_experience_years === "number") {
    strengths.push(
      exp.candidate_experience_years + " year(s) of experience detected"
    );
  }
  if (eduMatched.length > 0) {
    strengths.push("Education requirement found: " + eduMatched.join(", "));
  }
  if (result.resume_sections && result.resume_sections.length > 0) {
    strengths.push(
      "Good section coverage: " + result.resume_sections.slice(0, 5).join(", ")
    );
  }

  const gaps = [];
  if (missing.length > 0) {
    gaps.push("Missing required skills: " + missing.join(", "));
  }
  if (prefMissing.length > 0) {
    gaps.push("Missing preferred skills: " + prefMissing.join(", "));
  }
  if (eduMissing.length > 0) {
    gaps.push("Education requirement not detected: " + eduMissing.join(", "));
  }
  if (exp.minimum_requirement_met === false) {
    gaps.push("Minimum experience requirement is not met.");
  }
return (
    <div className="report">
      <div className="report-header">
        <div className="report-person">
          <div className="report-avatar">{displayName.charAt(0).toUpperCase()}</div>
          <div>
            <h3 className="report-name">{displayName}</h3>
            <span className={"match-badge " + tone}>
              {score >= 70 ? "Good fit" : "Review needed"}
            </span>
          </div>
        </div>

        <div className="report-facts">
          {fileName ? <span>{fileName}</span> : null}
          {typeof wordCount === "number" ? <span>{wordCount} words</span> : null}
        </div>

        <div className={"score-hero " + tone}>
          <div className="score-hero-ring">
            <svg width="118" height="118" viewBox="0 0 118 118">
              <circle className="ring-bg" cx="59" cy="59" r={r} />
              <circle
                className="ring-fg"
                cx="59"
                cy="59"
                r={r}
                strokeDasharray={circ}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="score-hero-text">
              <strong>{score}</strong>
              <small>/100</small>
              <span>ATS Score</span>
            </div>
          </div>
        </div>
      </div>

      {result.recommendation ? (
        <div className={"rec-banner " + tone}>
          <span className="rec-badge">AI</span>
          <p>{result.recommendation}</p>
        </div>
      ) : null}

      <Section title="Score Breakdown">
        <div className="scores-grid">
          <ScoreCard label="Required Skills" value={scores.required_keyword_score} />
          <ScoreCard label="Preferred Skills" value={scores.preferred_keyword_score} />
          <ScoreCard label="Skills Coverage" value={scores.skill_coverage} />
          <ScoreCard label="Resume Quality" value={scores.resume_quality_score} />
          <ScoreCard label="Education" value={scores.education_score} />
          <ScoreCard label="Experience" value={scores.experience_score} />
        </div>
      </Section>
<div className="report-cols">
        <div className="report-col">
          <Section title="Matched Skills">
            {matched.length > 0 ? (
              <div className="chips">
                {matched.map((s) => (
                  <Chip key={s} type="match">{s}</Chip>
                ))}
              </div>
            ) : (
              <p className="muted-text">No required skills were matched.</p>
            )}
          </Section>

          <Section title="Missing Skills">
            {missing.length > 0 ? (
              <div className="chips">
                {missing.map((s) => (
                  <Chip key={s} type="miss">{s}</Chip>
                ))}
              </div>
            ) : (
              <p className="muted-text">All required skills matched.</p>
            )}
          </Section>

          <Section title="Education">
            {eduMatched.length > 0 || eduMissing.length > 0 ? (
              <div className="edu-lines">
                {eduMatched.map((s) => (
                  <div className="edu-line ok" key={s}>
                    <i>+</i> {s}
                  </div>
                ))}
                {eduMissing.map((s) => (
                  <div className="edu-line miss" key={s}>
                    <i>!</i> {s}
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted-text">No education requirements were defined.</p>
            )}
          </Section>

          <Section title="Experience">
            <div className="exp-facts">
              <div className="exp-fact">
                <span>Detected years</span>
                <b>{exp.candidate_experience_years ?? "-"}</b>
              </div>
              <div className="exp-fact">
                <span>Minimum req.</span>
                <b className={exp.minimum_requirement_met ? "ok" : "bad"}>
                  {exp.minimum_requirement_met === true
                    ? "Met"
                    : exp.minimum_requirement_met === false
                    ? "Not met"
                    : "-"}
                </b>
              </div>
              <div className="exp-fact">
                <span>Maximum req.</span>
                <b className={exp.maximum_requirement_met ? "ok" : "bad"}>
                  {exp.maximum_requirement_met === true
                    ? "Met"
                    : exp.maximum_requirement_met === false
                    ? "Exceeded"
                    : "-"}
                </b>
              </div>
            </div>
          </Section>
        </div>
<div className="report-col">
          {prefMatched.length > 0 || prefMissing.length > 0 ? (
            <Section title="Preferred Skills">
              <div className="chips">
                {prefMatched.map((s) => (
                  <Chip key={s} type="match">{s}</Chip>
                ))}
                {prefMissing.map((s) => (
                  <Chip key={s} type="miss">{s}</Chip>
                ))}
              </div>
            </Section>
          ) : null}

          <Section title="Semantic Analysis">
            {semantic.length > 0 ? (
              <ul className="semantic-list">
                {semantic.map((s) => (
                  <li key={s.requirement}>
                    <span className={s.matched ? "ok" : "warn"}>
                      {s.matched ? "+" : "!"}
                    </span>
                    <span className="sem-name">{s.requirement}</span>
                    <b className={s.matched ? "ok" : "bad"}>{clampScore(s.score)}%</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">No extra semantic checks were required.</p>
            )}
          </Section>

          <Section title="Top Skill Matches">
            {matched.length > 0 ? (
              <div className="skill-list">
                {matched.slice(0, 5).map((name, i) => (
                  <SkillMatch key={name} name={name} value={100 - i * 6} />
                ))}
              </div>
            ) : (
              <p className="muted-text">No skill matches to show.</p>
            )}
          </Section>
        </div>
      </div>
<div className="report-cols">
        <div className="report-col">
          <Section title="Resume Strengths">
            {strengths.length > 0 ? (
              <ul className="strength-list">
                {strengths.map((s) => (
                  <li key={s}>
                    <i className="ok">+</i>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">No strengths recorded.</p>
            )}
          </Section>
        </div>
        <div className="report-col">
          <Section title="Areas for Improvement">
            {gaps.length > 0 ? (
              <ul className="improve-list">
                {gaps.map((s) => (
                  <li key={s}>
                    <i className="bad">!</i>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">No obvious gaps detected.</p>
            )}
          </Section>
        </div>
      </div>

      {improvements.length > 0 ? (
        <Section title="AI Suggestions">
          <ul className="suggestion-list">
            {improvements.map((s, i) => (
              <li key={i}>
                <span className="sug-num">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}