import Sidebar from "./Sidebar";
import Header from "./Header";

// Employer app shell: fixed sidebar + top header + content.
export default function Layout({ groups, active, onNav, onHome, children }) {
  return (
    <div className="app-shell">
      <Sidebar groups={groups} active={active} onNav={onNav} onHome={onHome} />
      <div className="app-main">
        <Header variant="employer" />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}