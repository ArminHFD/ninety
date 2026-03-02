import { useState } from "react";

export default function Habits() {
  const [habits, setHabits] = useState([
    { id: 1, name: "Drink 2L Water", completed: false },
    { id: 2, name: "Go to the Gym", completed: false },
    { id: 3, name: "Read 10 Pages", completed: false },
  ]);

  const toggleHabit = (id) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  const completedCount = habits.filter(h => h.completed).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Habits</h2>
        <p className="mt-1 text-gray-600">
          Today’s Habits – {completedCount} / {habits.length}
        </p>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between rounded-xl bg-gray-50 p-3"
          >
            <span>{habit.name}</span>
            <input
              type="checkbox"
              checked={habit.completed}
              onChange={() => toggleHabit(habit.id)}
            />
          </div>
        ))}
      </div>

      <button className="mt-4 rounded-xl bg-gray-200 px-4 py-2 text-sm">
        Add Habit +
      </button>
    </div>
  );
}