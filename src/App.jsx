import { useState } from "react";

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex-1 py-2 text-sm font-medium",
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
          <h2 className="text-lg font-semibold">{tab}</h2>
          <p className="mt-2 text-gray-600">
            {tab === "Dashboard" && "Overview of your 90-day progress."}
            {tab === "Habits" && "Add and tick habits."}
            {tab === "Journal" && "Daily reflection and mood."}
            {tab === "Focus" && "Pomodoro timer."}
            {tab === "Deadlines" && "Track important dates."}
            {tab === "Settings" && "Preferences and data controls."}
          </p>

          {/* quick dashboard placeholders match mockups */}
          {tab === "Dashboard" && (
            <div className="mt-5 space-y-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm font-semibold">Today’s Progress</div>
                <div className="mt-2 text-sm text-gray-600">
                  Habits: 0/0 • Journal: — • Focus: 0
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm font-semibold">Streak</div>
                <div className="mt-2 text-sm text-gray-600">0 day streak</div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm font-semibold">Next Priority</div>
                <div className="mt-2 text-sm text-gray-600">
                  No deadlines added yet
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm font-semibold">Your 90 Day Journey</div>
                <div className="mt-2 text-sm text-gray-600">Day 0 / 90</div>
                <div className="mt-3 grid grid-cols-10 gap-1">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-3 w-3 rounded-sm bg-gray-200"
                      title={`Day ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
        <div className="mx-auto flex max-w-md px-2">
          <NavItem label="Home" active={tab === "Dashboard"} onClick={() => setTab("Dashboard")} />
          <NavItem label="Habits" active={tab === "Habits"} onClick={() => setTab("Habits")} />
          <NavItem label="Journal" active={tab === "Journal"} onClick={() => setTab("Journal")} />
          <NavItem label="Focus" active={tab === "Focus"} onClick={() => setTab("Focus")} />
          <NavItem label="Deadlines" active={tab === "Deadlines"} onClick={() => setTab("Deadlines")} />
          <NavItem label="Settings" active={tab === "Settings"} onClick={() => setTab("Settings")} />
        </div>
      </nav>
    </div>
  );
}