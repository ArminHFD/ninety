import { useEffect, useState } from "react";
import { load, save } from "../utils/storage";

const STORAGE_KEY = "ninety.focus";

const TIMES = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function Focus() {
  const dateKey = todayKey();
  const dailyFocusKey = `ninety.focus.sessions.${dateKey}`;

  const savedData = load(STORAGE_KEY, {
    mode: "focus",
    timeLeft: TIMES.focus,
    isRunning: false,
    endTime: null,
  });

  const [mode, setMode] = useState(savedData.mode);
  const [timeLeft, setTimeLeft] = useState(savedData.timeLeft);
  const [isRunning, setIsRunning] = useState(savedData.isRunning);
  const [endTime, setEndTime] = useState(savedData.endTime);
  const [sessionCount, setSessionCount] = useState(() => load(dailyFocusKey, 0));

  useEffect(() => {
    save(STORAGE_KEY, {
      mode,
      timeLeft,
      isRunning,
      endTime,
    });
  }, [mode, timeLeft, isRunning, endTime]);

  useEffect(() => {
    save(dailyFocusKey, sessionCount);
  }, [dailyFocusKey, sessionCount]);

  useEffect(() => {
    if (!isRunning || !endTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.ceil((endTime - now) / 1000);

      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        setIsRunning(false);
        setEndTime(null);

        if (mode === "focus") {
          setSessionCount((count) => count + 1);
        }
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, endTime, mode]);

  useEffect(() => {
    if (isRunning && endTime) {
      const now = Date.now();
      const remaining = Math.ceil((endTime - now) / 1000);

      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
        setIsRunning(false);
        setEndTime(null);
      }
    }
  }, []);

  function getModeTime(newMode) {
    if (newMode === "focus") return TIMES.focus;
    if (newMode === "shortBreak") return TIMES.shortBreak;
    return TIMES.longBreak;
  }

  function changeMode(newMode) {
    setMode(newMode);
    setIsRunning(false);
    setEndTime(null);
    setTimeLeft(getModeTime(newMode));
  }

  function handleStartPause() {
    if (isRunning) {
      setIsRunning(false);
      setEndTime(null);
    } else {
      const finishTime = Date.now() + timeLeft * 1000;
      setEndTime(finishTime);
      setIsRunning(true);
    }
  }

  function handleReset() {
    setIsRunning(false);
    setEndTime(null);
    setTimeLeft(getModeTime(mode));
  }

  function getSubtitle() {
    if (mode === "focus") return "Time to Focus";
    if (mode === "shortBreak") return "Take a Short Break";
    return "Take a Long Break";
  }

  return (
    <div className="rounded-3xl bg-gray-200 p-5">
      <h2 className="text-4xl font-extrabold">Focus Timer</h2>
      <p className="mt-1 text-sm font-semibold text-gray-700">
        Deep Work Session
      </p>

      <div className="mt-6 flex justify-between gap-3">
        <button
          onClick={() => changeMode("focus")}
          className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm ${
            mode === "focus" ? "bg-white text-black" : "bg-gray-100 text-gray-700"
          }`}
        >
          Focus
        </button>

        <button
          onClick={() => changeMode("shortBreak")}
          className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm ${
            mode === "shortBreak" ? "bg-white text-black" : "bg-gray-100 text-gray-700"
          }`}
        >
          Short Break
        </button>

        <button
          onClick={() => changeMode("longBreak")}
          className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm ${
            mode === "longBreak" ? "bg-white text-black" : "bg-gray-100 text-gray-700"
          }`}
        >
          Long Break
        </button>
      </div>

      <div className="mt-10 text-center text-7xl font-light tracking-wide">
        {formatTime(timeLeft)}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          onClick={handleStartPause}
          className="rounded-2xl bg-white px-8 py-4 text-2xl font-semibold shadow-sm"
        >
          {isRunning ? "PAUSE" : "START"}
        </button>

        <button
          onClick={handleReset}
          className="rounded-2xl bg-gray-100 px-6 py-2 text-sm font-semibold shadow-sm"
        >
          Reset
        </button>
      </div>

      <div className="mt-10 text-center">
        <div className="text-2xl font-semibold">Session #{sessionCount}</div>
        <div className="mt-1 text-2xl font-semibold">{getSubtitle()}</div>
      </div>
    </div>
  );
}