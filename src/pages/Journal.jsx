import { useEffect, useState } from "react";
import { load, save } from "../utils/storage";

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function Journal() {
  const dateKey = todayKey();
  const storageKey = `ninety.journal.${dateKey}`;

  const [mood, setMood] = useState(() => load(storageKey, {}).mood || "");
  const [rating, setRating] = useState(() => load(storageKey, {}).rating || 0);
  const [notes, setNotes] = useState(() => load(storageKey, {}).notes || "");

  // Save whenever something changes
  useEffect(() => {
    save(storageKey, { mood, rating, notes });
  }, [storageKey, mood, rating, notes]);

  function selectMood(value) {
    setMood(value);
  }

  function selectRating(value) {
    setRating(value);
  }

  return (
    <div className="rounded-3xl bg-gray-200 p-5">
      <h2 className="text-3xl font-extrabold">Journal</h2>
      <p className="mt-1 text-sm font-semibold text-gray-700">
        Today’s reflection — {dateKey}
      </p>

      {/* Mood */}
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">Mood</div>
        <div className="mt-3 flex gap-3 text-2xl">
          <button
            onClick={() => selectMood("😕")}
            className={mood === "😕" ? "rounded-xl bg-gray-100 px-3 py-2" : "rounded-xl px-3 py-2"}
            aria-label="Mood: not great"
          >
            😕
          </button>
          <button
            onClick={() => selectMood("😐")}
            className={mood === "😐" ? "rounded-xl bg-gray-100 px-3 py-2" : "rounded-xl px-3 py-2"}
            aria-label="Mood: okay"
          >
            😐
          </button>
          <button
            onClick={() => selectMood("🙂")}
            className={mood === "🙂" ? "rounded-xl bg-gray-100 px-3 py-2" : "rounded-xl px-3 py-2"}
            aria-label="Mood: good"
          >
            🙂
          </button>
        </div>
        {mood && <div className="mt-2 text-sm text-gray-600">Selected: {mood}</div>}
      </div>

      {/* Star rating */}
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">Rate your day</div>
        <div className="mt-3 flex gap-2 text-2xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => selectRating(n)}
              className="px-1"
              aria-label={`Rate ${n} star`}
            >
              {rating >= n ? "★" : "☆"}
            </button>
          ))}
        </div>
        {rating > 0 && (
          <div className="mt-2 text-sm text-gray-600">Rating: {rating} / 5</div>
        )}
      </div>

      {/* Notes */}
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">Notes</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write a short reflection about your day..."
          className="mt-3 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none"
          rows={6}
        />
      </div>
    </div>
  );
}