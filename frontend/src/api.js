// =====================================================
// CareerPilot AI - shared API layer
// Talks only to the existing FastAPI backend.
// ================================================

export const API = "http://127.0.0.1:8000";

// Post FormData to the existing ATS analyze endpoint.
export function analyzeResume(payload) {
  const form = new FormData();
  form.append("file", payload.file);
  form.append("job_title", payload.jobTitle || "");
  form.append("job_description", payload.jobDescription || "");
  form.append("required_keywords", (payload.required || []).join(", "));
  form.append("preferred_keywords", (payload.preferred || []).join(", "));
  form.append("education", (payload.education || []).join(", "));
  form.append("experience_min", String(payload.expMin ?? 0));
  const max = payload.expMax;
  if (max !== null && max !== undefined && String(max).trim() !== "") {
    form.append("experience_max", String(max));
  }
  return fetch(API + "/api/ats/analyze", {
    method: "POST",
    body: form,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || "Analysis failed. Is the backend running?");
    }
    return data;
  });
}

// Derive a display name from an uploaded resume file name.
export function candidateNameFromFile(file) {
  const base = (file?.name || "Candidate").replace(/\.[^.]+$/, "");
  const words = base.replace(/[-_]+/gi, " ").split(/\s+/).filter(Boolean);
  const named = words
    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w.toUpperCase()))
    .join(" ");
  return named || "Candidate";
}

export function fileBase(name) {
  return String(name || "").replace(/\.[^.]+$/, "");
}

export function clampScore(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function scoreTone(value) {
  const n = clampScore(value);
  if (n >= 75) return "good";
  if (n >= 55) return "mid";
  return "low";
}

export function splitList(value) {
  return String(value || "")
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}