import { useEffect, useState } from "react";
import { load, save } from "../utils/storage";

const STORAGE_KEY = "ninety.planner.items";

function formatDate(dueISO) {
  const [y, m, d] = dueISO.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
}

function daysLeft(dueISO) {
  const [y, m, d] = dueISO.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  due.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function Planner() {
  const [items, setItems] = useState(() => load(STORAGE_KEY, []));
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    save(STORAGE_KEY, items);
  }, [items]);

  const sortedItems = [...items].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  function addItem() {
    const cleanTitle = title.trim();
    if (!cleanTitle || !dueDate) return;

    const newItem = { id: Date.now(), title: cleanTitle, dueDate };
    setItems((prev) => [...prev, newItem]);

    setTitle("");
    setDueDate("");
    setShowForm(false);
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="rounded-3xl bg-gray-200 p-5">
      <h2 className="text-4xl font-extrabold">Planner</h2>
      <p className="mt-1 text-sm font-semibold text-gray-700">Upcoming Deadlines</p>

      <div className="mt-4 rounded-3xl bg-gray-200 p-4">
        <div className="space-y-4">
          {sortedItems.length === 0 ? (
            <div className="rounded-2xl bg-white p-4 text-sm text-gray-600">
              No deadlines yet. Add your first one below.
            </div>
          ) : (
            sortedItems.map((item) => {
              const left = daysLeft(item.dueDate);
              const urgent = left <= 3 && left >= 0;
              const overdue = left < 0;

              let rightText = `${left} Days Left`;
              if (left === 1) rightText = "1 Day Left";
              if (left === 0) rightText = "Due Today";
              if (overdue) rightText = "Overdue";

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white px-4 py-3 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-gray-700">
                      Due: {formatDate(item.dueDate)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "text-sm font-semibold",
                        overdue || urgent ? "text-red-600" : "text-gray-900",
                      ].join(" ")}
                    >
                      {rightText}
                    </div>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-sm font-semibold text-gray-500 hover:text-gray-900"
                      aria-label={`Delete ${item.title}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-2xl bg-white px-6 py-3 font-semibold shadow-sm"
          >
            Add Deadline +
          </button>
        </div>

        {showForm && (
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold">New deadline</div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Book Appointment"
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