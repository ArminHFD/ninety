import { save, load } from "../utils/storage";
import { signInUser } from "../utils/firebase";
import { backupToCloud } from "../utils/sync";
import { useEffect, useState } from "react";

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function resetChallenge() {
  const todayKey = getLocalDateKey(new Date());

  save("ninety.startDate", todayKey);
  localStorage.removeItem("ninety.planner.items");

  const keysToRemove = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (
      key &&
      (
        key.startsWith("ninety.habits.completed.") ||
        key.startsWith("ninety.journal.") ||
        key.startsWith("ninety.focus.sessions.")
      )
    ) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Settings({ theme, setTheme }) {
  const [habitReminders, setHabitReminders] = useState(() =>
    load("ninety.settings.habitReminders", false)
  );

  const [focusAlerts, setFocusAlerts] = useState(() =>
    load("ninety.settings.focusAlerts", false)
  );

  const [targetHabits, setTargetHabits] = useState(() =>
    load("ninety.settings.targetHabits", 4)
  );

  useEffect(() => {
    save("ninety.settings.habitReminders", habitReminders);
  }, [habitReminders]);

  useEffect(() => {
    save("ninety.settings.focusAlerts", focusAlerts);
  }, [focusAlerts]);

  useEffect(() => {
    save("ninety.settings.targetHabits", targetHabits);
  }, [targetHabits]);

  async function handleReset() {
    const confirmed = window.confirm(
      "Are you sure you want to reset the 90 day challenge? This will clear progress, journal entries, focus sessions, and planner items, but keep your habits list."
    );

    if (!confirmed) return;

    resetChallenge();

    try {
      await signInUser();
      await backupToCloud();
    } catch (error) {
      console.error("Cloud reset backup failed:", error);
    }

    window.location.reload();
  }

  function handleExport() {
    const data = {
      habits: load("ninety.habits", []),
      plannerItems: load("ninety.planner.items", []),
      startDate: load("ninety.startDate", null),
      settings: {
        habitReminders,
        focusAlerts,
        theme,
        targetHabits,
      },
      localStorageKeys: Object.fromEntries(
        Object.keys(localStorage)
          .filter((key) => key.startsWith("ninety."))
          .map((key) => [key, load(key, null)])
      ),
    };

    downloadJSON("ninety-progress.json", data);
  }

  function handleFeedback() {
    window.location.href =
      "mailto:arminhatamifard@outlook.com?subject=NINETY%20App%20Feedback&body=Share%20your%20feedback%20here...";
  }

  function handleTargetChange(value) {
    const number = Number(value);
    if (Number.isNaN(number)) return;
    if (number < 1) return;
    setTargetHabits(number);
  }

  function Toggle({ value, onToggle }) {
    return (
      <button
        onClick={onToggle}
        className={`relative h-8 w-14 rounded-full transition ${
          value ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full transition ${
            value
              ? "left-7 bg-white dark:bg-black"
              : "left-1 bg-white"
          }`}
        />
      </button>
    );
  }

  const activeBtn =
    "bg-black text-white dark:bg-white dark:text-black";
  const inactiveBtn =
    "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";

  return (
    <div className="rounded-[24px] bg-gray-200 p-5 dark:bg-gray-700">
      <h2 className="text-4xl font-extrabold tracking-tight dark:text-white">
        Settings
      </h2>
      <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Personalisation & Preferences
      </p>

      <div className="mt-5 space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-lg font-bold dark:text-white">Reminders</div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm font-medium dark:text-white">Habit Reminders</div>
            <Toggle value={habitReminders} onToggle={() => setHabitReminders((prev) => !prev)} />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm font-medium dark:text-white">Focus Timer Alerts</div>
            <Toggle value={focusAlerts} onToggle={() => setFocusAlerts((prev) => !prev)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`rounded-2xl px-4 py-4 text-base font-semibold shadow-sm transition ${
              theme === "light" ? activeBtn : inactiveBtn
            }`}
          >
            Light Mode
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`rounded-2xl px-4 py-4 text-base font-semibold shadow-sm transition ${
              theme === "dark" ? activeBtn : inactiveBtn
            }`}
          >
            Dark Mode
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold dark:text-white">Target habits per day</div>
            <input
              type="number"
              min="1"
              value={targetHabits}
              onChange={(e) => handleTargetChange(e.target.value)}
              className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-right text-lg font-semibold outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={handleExport}
          className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-4 text-base font-semibold shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          Export Progress
        </button>

        <button
          onClick={handleReset}
          className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-4 text-base font-semibold shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          Reset Data
        </button>

        <div className="pt-6">
          <button
            onClick={handleFeedback}
            className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-4 text-base font-semibold shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );
}