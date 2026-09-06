import { useState } from "react";

// Reusable PDF/DOCX drag-drop upload area.
export default function ResumeUpload({ file, onSelect, onClear, inputId, label }) {
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState("");

  function acceptFile(f) {
    if (!f) return;
    const name = f.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
      setLocalError("Only PDF or DOCX files are supported.");
      return;
    }
    setLocalError("");
    onSelect(f);
  }

  function pick(e) {
    acceptFile(e.target.files?.[0]);
    if (e.target) e.target.value = "";
  }

  function drop(e) {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="upload-wrap">
      <div
        className={"upload-zone" + (dragging ? " dragging" : "")}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
        onClick={() => document.getElementById(inputId).click()}
      >
        <input
          id={inputId}
          type="file"
          accept=".pdf,.docx"
          hidden
          onChange={pick}
        />
        <div className="upload-icon">+</div>
        {file ? (
          <div className="upload-text">
            <strong>{file.name}</strong>
            <span>Resume selected - PDF or DOCX verified</span>
          </div>
        ) : (
          <div className="upload-text">
            <strong>{label || "Drag a resume here or click to browse"}</strong>
            <span>PDF or DOCX resume up to 5 MB</span>
          </div>
        )}
        {file ? (
          <button
            className="btn btn-ghost btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              setLocalError("");
              onClear && onClear();
            }}
          >
            Remove
          </button>
        ) : (
          <span className="upload-hint">Click to choose a file</span>
        )}
      </div>
      {localError ? <div className="form-error">{localError}</div> : null}
    </div>
  );
}