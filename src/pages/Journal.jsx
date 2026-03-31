import { useEffect, useState } from "react";
import { load, save } from "../utils/storage";

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function Journal() {
  const dateKey = todayKey();
  const storageKey = `ninety.journal.${dateKey}`;

  const [mood, setMood] = useState(() => load(storageKey, {}).mood || "");
  const [rating, setRating] = useState(() => load(storageKey, {}).rating || 0);
  const [notes, setNotes] = useState(() => load(storageKey, {}).notes || "");

  useEffect(() => {
    save(storageKey, { mood, rating, notes });
  }, [storageKey, mood, rating, notes]);

  return (
    <div className="rounded-[24px] bg-gray-200 p-5 dark:bg-gray-700">
      <h2 className="text-4xl font-extrabold tracking-tight dark:text-white">
        Journal
      </h2>
      <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Today&apos;s reflection — {dateKey}
      </p>

      <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="text-sm font-semibold dark:text-white">Mood</div>
        <div className="mt-3 flex gap-3 text-2xl">
          {["😕", "😐", "🙂"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => setMood(emoji)}
              className={`rounded-xl px-3 py-2 transition ${
                mood === emoji
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "dark:bg-gray-800"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
        {mood && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Selected: {mood}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="text-sm font-semibold dark:text-white">Rate your day</div>
        <div className="mt-3 flex gap-2 text-2xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className="px-1 dark:text-white"
            >
              {rating >= n ? "★" : "☆"}
            </button>
          ))}
        </div>
        {rating > 0 && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Rating: {rating} / 5
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="text-sm font-semibold dark:text-white">Notes</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write a short reflection about your day..."
          className="mt-3 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          rows={6}
        />
      </div>
    </div>
  );
}