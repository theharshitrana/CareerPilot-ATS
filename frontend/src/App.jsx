import { useState } from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";
import EmployerDashboard from "./components/EmployerDashboard";
import CandidateDashboard from "./components/CandidateDashboard";

function App() {
  const [mode, setMode] = useState("landing");

  if (mode === "landing") {
    return <LandingPage onSelect={setMode} />;
  }

  if (mode === "employer") {
    return <EmployerDashboard onBack={() => setMode("landing")} />;
  }

  return <CandidateDashboard onBack={() => setMode("landing")} />;
}

export default App;