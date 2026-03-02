import Dashboard from "./pages/Dashboard.jsx";
import Habits from "./pages/Habits.jsx";
import Journal from "./pages/Journal.jsx";
import Focus from "./pages/Focus.jsx";
import Planner from "./pages/Planner.jsx";
import Settings from "./pages/Settings.jsx";
import { useState } from "react";

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex-1 py-3 text-sm font-medium",
        active ? "text-gray-900" : "text-gray-500",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function App() {
  const [tab, setTab] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="px-4 pt-6 pb-3 text-center">
        <div className="text-xl font-semibold tracking-wide">NINETY</div>
        <div className="text-sm text-gray-600">{tab}</div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 pb-24">
        <div className="rounded-2xl bg-white p-5 shadow">
          {tab === "Dashboard" && <Dashboard />}
          {tab === "Habits" && <Habits />}
          {tab === "Journal" && <Journal />}
          {tab === "Focus" && <Focus />}
          {tab === "Planner" && <Planner />}
          {tab === "Settings" && <Settings />}
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
        <div className="mx-auto flex max-w-md px-2">
          <NavItem label="Home" active={tab === "Dashboard"} onClick={() => setTab("Dashboard")} />
          <NavItem label="Habits" active={tab === "Habits"} onClick={() => setTab("Habits")} />
          <NavItem label="Journal" active={tab === "Journal"} onClick={() => setTab("Journal")} />
          <NavItem label="Focus" active={tab === "Focus"} onClick={() => setTab("Focus")} />
          <NavItem label="Planner" active={tab === "Planner"} onClick={() => setTab("Planner")} />
          <NavItem label="Settings" active={tab === "Settings"} onClick={() => setTab("Settings")} />
        </div>
      </nav>
    </div>
  );
}