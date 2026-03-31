import { load, save } from "../utils/storage";

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getDaysLeft(dueISO) {
  const [y, m, d] = dueISO.split("-").map(Number);

  const dueDate = new Date(y, m - 1, d);
  dueDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const difference = dueDate - today;
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function getDateKeyFromOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date.toISOString().slice(0, 10);
}

function isJournalDone(journal) {
  return (
    journal.mood ||
    journal.rating > 0 ||
    (journal.notes && journal.notes.trim() !== "")
  );
}

function calculateStreak(habits) {
  let streak = 0;

  for (let i = 0; i < 90; i++) {
    const dateKey = getDateKeyFromOffset(i);

    const completedMap = load(`ninety.habits.completed.${dateKey}`, {});
    const journal = load(`ninety.journal.${dateKey}`, {});
    const focusSessions = load(`ninety.focus.sessions.${dateKey}`, 0);

    const allHabitsDone =
      habits.length > 0 &&
      habits.every((habit) => completedMap[habit.id]);

    const journalDone = isJournalDone(journal);
    const focusDone = focusSessions > 0;

    if (allHabitsDone && journalDone && focusDone) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default function Dashboard() {
  const dateKey = todayKey();

  // Ensure start date exists
  const existingStartDate = load("ninety.startDate", null);
  if (!existingStartDate) {
    save("ninety.startDate", dateKey);
  }

  const habits = load("ninety.habits", []);
  const completedMap = load(`ninety.habits.completed.${dateKey}`, {});
  const completedCount = habits.filter((habit) => completedMap[habit.id]).length;

  const journal = load(`ninety.journal.${dateKey}`, {});
  const journalDone = isJournalDone(journal);

  const focusSessions = load(`ninety.focus.sessions.${dateKey}`, 0);

  const plannerItems = load("ninety.planner.items", []);
  const upcomingItems = [...plannerItems]
    .filter((item) => getDaysLeft(item.dueDate) >= 0)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const nextPriority = upcomingItems.length > 0 ? upcomingItems[0] : null;

  const startDate = load("ninety.startDate", dateKey);
  const start = new Date(startDate);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const dayNumber = Math.min(
    90,
    Math.max(1, Math.ceil((today - start) / (1000 * 60 * 60 * 24)) + 1)
  );

  const streak = calculateStreak(habits);

  return (
    <div className="rounded-3xl bg-gray-200 p-5">
      <h2 className="text-4xl font-extrabold">Dashboard</h2>
      <p className="mt-1 text-sm font-semibold text-gray-700">
        Welcome to your 90 Day Challenge
      </p>

      <div className="mt-4 space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="text-lg font-semibold">Today&apos;s Progress</div>
          <div className="mt-3 text-sm text-gray-700">
            <div>Habits Completed: {completedCount} / {habits.length}</div>
            <div>Journal: {journalDone ? "Completed" : "Not Completed"}</div>
            <div>Focus Sessions: {focusSessions}</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm text-center">
          <div className="text-3xl font-bold">
            {streak} Day Streak 🔥
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="text-lg font-semibold">Next Priority</div>
          <div className="mt-2 text-sm text-gray-700">
            {nextPriority ? (
              <>
                <div>{nextPriority.title}</div>
                <div>{getDaysLeft(nextPriority.dueDate)} Days Left</div>
              </>
            ) : (
              <div>No upcoming deadlines</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Progress</div>
            <div className="text-lg font-semibold">Day {dayNumber}/90</div>
          </div>

          <div className="mt-4 grid grid-cols-10 gap-2">
            {Array.from({ length: 90 }).map((_, index) => {
              const filled = index < dayNumber;

              return (
                <div
                  key={index}
                  className={`h-4 w-4 rounded-sm border ${
                    filled ? "bg-green-500 border-green-500" : "bg-white border-gray-400"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}