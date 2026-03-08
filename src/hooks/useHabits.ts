import { useState, useEffect, useCallback } from "react";

export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
}

const HABITS_KEY = "habit-tracker-habits";
const LOGS_KEY = "habit-tracker-logs";

const today = () => new Date().toISOString().split("T")[0];

const getPastDays = (n: number): string[] => {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
};

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = localStorage.getItem(HABITS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [logs, setLogs] = useState<HabitLog[]>(() => {
    const stored = localStorage.getItem(LOGS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }, [logs]);

  const addHabit = useCallback((name: string, color: string, icon: string) => {
    const habit: Habit = {
      id: crypto.randomUUID(),
      name,
      color,
      icon,
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, habit]);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setLogs((prev) => prev.filter((l) => l.habitId !== id));
  }, []);

  const toggleToday = useCallback((habitId: string) => {
    const date = today();
    setLogs((prev) => {
      const existing = prev.find((l) => l.habitId === habitId && l.date === date);
      if (existing) {
        return existing.completed
          ? prev.filter((l) => !(l.habitId === habitId && l.date === date))
          : prev.map((l) =>
              l.habitId === habitId && l.date === date ? { ...l, completed: true } : l
            );
      }
      return [...prev, { habitId, date, completed: true }];
    });
  }, []);

  const isCompletedToday = useCallback(
    (habitId: string) => {
      return logs.some((l) => l.habitId === habitId && l.date === today() && l.completed);
    },
    [logs]
  );

  const getStreak = useCallback(
    (habitId: string) => {
      let streak = 0;
      const d = new Date();
      while (true) {
        const dateStr = d.toISOString().split("T")[0];
        const completed = logs.some(
          (l) => l.habitId === habitId && l.date === dateStr && l.completed
        );
        if (!completed) break;
        streak++;
        d.setDate(d.getDate() - 1);
      }
      return streak;
    },
    [logs]
  );

  const getTotalCompletions = useCallback(
    (habitId: string) => logs.filter((l) => l.habitId === habitId && l.completed).length,
    [logs]
  );

  const getWeekData = useCallback(
    (habitId: string) => {
      const days = getPastDays(7);
      return days.map((date) => ({
        date,
        completed: logs.some((l) => l.habitId === habitId && l.date === date && l.completed),
        day: new Date(date + "T12:00:00").toLocaleDateString("en", { weekday: "short" }),
      }));
    },
    [logs]
  );

  return {
    habits,
    addHabit,
    deleteHabit,
    toggleToday,
    isCompletedToday,
    getStreak,
    getTotalCompletions,
    getWeekData,
  };
};
