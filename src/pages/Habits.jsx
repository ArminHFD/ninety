import { useEffect, useState } from "react";
import { load, save } from "../utils/storage";

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const DEFAULT_HABITS = [
  { id: 1, name: "Drink 2L Water" },
  { id: 2, name: "Go to the Gym" },
  { id: 3, name: "Read 10 Pages" },
];

export default function Habits() {
  const dateKey = todayKey();

  const [habits, setHabits] = useState(() =>
    load("ninety.habits", DEFAULT_HABITS)
  );

  const [completedMap, setCompletedMap] = useState(() =>
    load(`ninety.habits.completed.${dateKey}`, {})
  );

  useEffect(() => {
    save("ninety.habits", habits);
  }, [habits]);

  useEffect(() => {
    save(`ninety.habits.completed.${dateKey}`, completedMap);
  }, [completedMap, dateKey]);

  function toggleHabit(id) {
    setCompletedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function addHabit() {
    const name = prompt("New habit name:");
    if (!name) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    setHabits((prev) => [...prev, { id: Date.now(), name: trimmed }]);
  }

  function deleteHabit(id) {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));

    setCompletedMap((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }

  const completedCount = habits.filter((h) => completedMap[h.id]).length;

  return (
    <div className="rounded-[24px] bg-gray-200 p-5 dark:bg-gray-700">
      <h2 className="text-4xl font-extrabold tracking-tight dark:text-white">
        Habits
      </h2>
      <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Today&apos;s Habits — {completedCount} / {habits.length}
      </p>

      <div className="mt-5 space-y-3">
        {habits.map((h) => (
          <div
            key={h.id}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!completedMap[h.id]}
                onChange={() => toggleHabit(h.id)}
                className="h-5 w-5"
              />
              <div className="text-base font-medium dark:text-white">{h.name}</div>
            </div>

            <button
              onClick={() => deleteHabit(h.id)}
              className="text-sm font-semibold text-gray-400 transition hover:text-gray-700 dark:hover:text-white"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addHabit}
        className="mt-5 rounded-2xl border border-gray-100 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:scale-[1.01] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        Add Habit +
      </button>
    </div>
  );
}