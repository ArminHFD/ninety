import { useEffect, useState } from "react";
import { load, save } from "../utils/storage";

const STORAGE_KEY = "ninety.planner.items";

function formatDate(dueISO) {
  const [y, m, d] = dueISO.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
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

export default function Planner() {
  const [items, setItems] = useState(() => load(STORAGE_KEY, []));
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    save(STORAGE_KEY, items);
  }, [items]);

  const sortedItems = [...items].sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate)
  );

  function addItem() {
    const cleanTitle = title.trim();

    if (!cleanTitle || !dueDate) return;

    const newItem = {
      id: Date.now(),
      title: cleanTitle,
      dueDate,
    };

    setItems((prev) => [...prev, newItem]);
    setTitle("");
    setDueDate("");
    setShowForm(false);
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="rounded-3xl bg-gray-200 p-5">
      <h2 className="text-4xl font-extrabold">Planner</h2>
      <p className="mt-1 text-sm font-semibold text-gray-700">
        Upcoming Deadlines
      </p>

      <div className="mt-4 space-y-4">
        {sortedItems.length === 0 ? (
          <div className="rounded-2xl bg-white p-4 text-sm text-gray-600 shadow-sm">
            No deadlines yet. Add your first one below.
          </div>
        ) : (
          sortedItems.map((item) => {
            const daysLeft = getDaysLeft(item.dueDate);
            const isUrgent = daysLeft <= 3 && daysLeft >= 0;
            const isOverdue = daysLeft < 0;

            let daysText = `${daysLeft} Days Left`;

            if (daysLeft === 1) daysText = "1 Day Left";
            if (daysLeft === 0) daysText = "Due Today";
            if (isOverdue) daysText = "Overdue";

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm text-gray-700">
                      Due: {formatDate(item.dueDate)}
                    </div>
                    <div
                      className={`mt-1 text-sm font-semibold ${
                        isUrgent || isOverdue ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {daysText}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-sm font-semibold text-gray-400 hover:text-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold shadow-sm"
        >
          Add Deadline +
        </button>

        {showForm && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold">New deadline</div>

            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-3 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-3 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none"
            />

            <div className="mt-3 flex gap-2">
              <button
                onClick={addItem}
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Add
              </button>

              <button
                onClick={() => {
                  setShowForm(false);
                  setTitle("");
                  setDueDate("");
                }}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}