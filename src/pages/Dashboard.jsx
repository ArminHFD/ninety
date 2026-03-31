import { load, save } from "../utils/storage";

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayKey() {
  return getLocalDateKey(new Date());
}

function parseLocalDate(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getDaysLeft(dueISO) {
  const dueDate = parseLocalDate(dueISO);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const difference = dueDate - today;
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function getDateKeyFromOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  date.setHours(0, 0, 0, 0);
  return getLocalDateKey(date);
}

function isJournalDone(journal) {
  return (
    journal.mood ||
    journal.rating > 0 ||
    (journal.notes && journal.notes.trim() !== "")
  );
}

function isDayCompleted(dateKey, habits) {
  const completedMap = load(`ninety.habits.completed.${dateKey}`, {});
  const journal = load(`ninety.journal.${dateKey}`, {});
  const focusSessions = load(`ninety.focus.sessions.${dateKey}`, 0);

  const allHabitsDone =
    habits.length > 0 &&
    habits.every((habit) => completedMap[habit.id]);

  const journalDone = isJournalDone(journal);
  const focusDone = focusSessions > 0;

  return allHabitsDone && journalDone && focusDone;
}

function calculateStreak(habits) {
  let streak = 0;

  for (let i = 0; i < 90; i++) {
    const dateKey = getDateKeyFromOffset(i);

    if (isDayCompleted(dateKey, habits)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default function Dashboard() {
  const dateKey = todayKey();

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
  const start = parseLocalDate(startDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayNumber = Math.min(
    90,
    Math.max(1, Math.ceil((today - start) / (1000 * 60 * 60 * 24)) + 1)
  );

  const streak = calculateStreak(habits);

  function StatCard({ title, children, center = false }) {
    return (
      <div className={`rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${center ? "text-center" : ""}`}>
        <div className="text-lg font-semibold dark:text-white">{title}</div>
        <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">{children}</div>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] bg-gray-200 p-5 dark:bg-gray-700">
      <h2 className="text-4xl font-extrabold tracking-tight dark:text-white">
        Dashboard
      </h2>
      <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Welcome to your 90 Day Challenge
      </p>

      <div className="mt-5 space-y-4">
        <StatCard title="Today's Progress">
          <div>Habits Completed: {completedCount} / {habits.length}</div>
          <div>Journal: {journalDone ? "Completed" : "Not Completed"}</div>
          <div>Focus Sessions: {focusSessions}</div>
        </StatCard>

        <div className="rounded-2xl border border-orange-100 bg-white p-4 text-center shadow-sm dark:border-orange-900 dark:bg-gray-800">
          <div className="text-3xl font-bold dark:text-white">
            {streak} Day Streak 🔥
          </div>
        </div>

        <StatCard title="Next Priority">
          {nextPriority ? (
            <>
              <div className="font-medium">{nextPriority.title}</div>
              <div className="mt-1">{getDaysLeft(nextPriority.dueDate)} Days Left</div>
            </>
          ) : (
            <div>No upcoming deadlines</div>
          )}
        </StatCard>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold dark:text-white">Progress</div>
            <div className="text-lg font-semibold dark:text-white">Day {dayNumber}/90</div>
          </div>

          <div className="mt-4 grid grid-cols-10 gap-2">
            {Array.from({ length: 90 }).map((_, index) => {
              const targetDate = new Date(start);
              targetDate.setDate(start.getDate() + index);
              targetDate.setHours(0, 0, 0, 0);

              const targetKey = getLocalDateKey(targetDate);
              const isFuture = targetDate.getTime() > today.getTime();

              let boxClass = "bg-white border-gray-400 dark:bg-gray-900 dark:border-gray-600";

              if (!isFuture) {
                const completed = isDayCompleted(targetKey, habits);
                boxClass = completed
                  ? "bg-green-500 border-green-500"
                  : "bg-red-400 border-red-400";
              }

              return (
                <div
                  key={index}
                  className={`h-4 w-4 rounded-sm border ${boxClass}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}