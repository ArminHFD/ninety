import Dashboard from "./pages/Dashboard.jsx";
import Habits from "./pages/Habits.jsx";
import Journal from "./pages/Journal.jsx";
import Focus from "./pages/Focus.jsx";
import Planner from "./pages/Planner.jsx";
import Settings from "./pages/Settings.jsx";
import { useEffect, useState } from "react";
import { signInUser } from "./utils/firebase";
import { backupToCloud, restoreFromCloud } from "./utils/sync";
import { load, save } from "./utils/storage";
import {
  House,
  SquareCheckBig,
  BookOpen,
  Clock3,
  CalendarDays,
  Settings as SettingsIcon,
} from "lucide-react";

function NavItem({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex flex-1 items-center justify-center py-4 transition",
        active
          ? "text-black dark:text-white"
          : "text-gray-500 dark:text-gray-400",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-12 w-12 items-center justify-center rounded-2xl transition",
          active
            ? "bg-white shadow-sm dark:bg-gray-800"
            : "bg-transparent",
        ].join(" ")}
      >
        {icon}
      </div>
    </button>
  );
}

export default function App() {
  const [tab, setTab] = useState("Dashboard");
  const [theme, setTheme] = useState(() =>
    load("ninety.settings.theme", "light")
  );

  useEffect(() => {
    save("ninety.settings.theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    document.body.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    const savedTheme = load("ninety.settings.theme", "light");
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    async function setupCloudSync() {
      try {
        await signInUser();
        await restoreFromCloud();
      } catch (error) {
        console.error("Cloud sync setup failed:", error);
      }
    }

    setupCloudSync();
  }, []);

  useEffect(() => {
    async function syncToCloud() {
      try {
        await backupToCloud();
      } catch (error) {
        console.error("Cloud backup failed:", error);
      }
    }

    syncToCloud();
  }, [tab]);

  return (
    <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="px-4 pt-7 pb-4 text-center">
          <div className="text-3xl font-black tracking-tight">NINETY</div>
          <div className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {tab}
          </div>
        </header>

        <main className="flex-1 px-4 pb-28">
          <div className="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {tab === "Dashboard" && <Dashboard />}
            {tab === "Habits" && <Habits />}
            {tab === "Journal" && <Journal />}
            {tab === "Focus" && <Focus />}
            {tab === "Planner" && <Planner />}
            {tab === "Settings" && (
              <Settings theme={theme} setTheme={setTheme} />
            )}
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
          <div className="mx-auto flex max-w-md px-3">
            <NavItem
              icon={<House size={28} strokeWidth={2.2} />}
              active={tab === "Dashboard"}
              onClick={() => setTab("Dashboard")}
            />
            <NavItem
              icon={<SquareCheckBig size={28} strokeWidth={2.2} />}
              active={tab === "Habits"}
              onClick={() => setTab("Habits")}
            />
            <NavItem
              icon={<BookOpen size={28} strokeWidth={2.2} />}
              active={tab === "Journal"}
              onClick={() => setTab("Journal")}
            />
            <NavItem
              icon={<Clock3 size={28} strokeWidth={2.2} />}
              active={tab === "Focus"}
              onClick={() => setTab("Focus")}
            />
            <NavItem
              icon={<CalendarDays size={28} strokeWidth={2.2} />}
              active={tab === "Planner"}
              onClick={() => setTab("Planner")}
            />
            <NavItem
              icon={<SettingsIcon size={28} strokeWidth={2.2} />}
              active={tab === "Settings"}
              onClick={() => setTab("Settings")}
            />
          </div>
        </nav>
      </div>
    </div>
  );
}