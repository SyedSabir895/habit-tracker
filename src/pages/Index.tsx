import { useMemo, useEffect, useState } from "react";
import { Zap, Sun, Moon } from "lucide-react";
import HabitCard from "@/components/HabitCard";
import AddHabitForm from "@/components/AddHabitForm";
import { useHabits } from "@/hooks/useHabits";

const QUOTES = [
  "We are what we repeatedly do. Excellence is not an act, but a habit.",
  "Small daily improvements over time lead to stunning results.",
  "Motivation gets you going, but discipline keeps you growing.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The secret of your future is hidden in your daily routine.",
  "Don't count the days. Make the days count.",
  "Consistency is what transforms average into excellence.",
  "A river cuts through rock not because of its power, but its persistence.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Habits are the compound interest of self-improvement.",
];

const Index = () => {
  const { habits, addHabit, deleteHabit, toggleToday, isCompletedToday, getStreak, getTotalCompletions, getWeekData } = useHabits();

  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const quote = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000);
    return QUOTES[day % QUOTES.length];
  }, []);

  const completedToday = habits.filter((h) => isCompletedToday(h.id)).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Zap className="text-primary" size={24} /> Habits
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {completedToday}/{habits.length} completed today
            </p>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Quote */}
        <div className="mb-6 rounded-lg bg-secondary p-4">
          <p className="text-sm italic text-secondary-foreground">"{quote}"</p>
        </div>

        {/* Progress bar */}
        {habits.length > 0 && (
          <div className="mb-6">
            <div className="h-2 w-full overflow-hidden rounded-full bg-chart-empty">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(completedToday / habits.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Habits */}
        <div className="mb-4 flex flex-col gap-3">
          {habits.map((habit, i) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              icon={habit.icon}
              color={habit.color}
              completed={isCompletedToday(habit.id)}
              streak={getStreak(habit.id)}
              total={getTotalCompletions(habit.id)}
              weekData={getWeekData(habit.id)}
              onToggle={() => toggleToday(habit.id)}
              onDelete={() => deleteHabit(habit.id)}
              index={i}
            />
          ))}
        </div>

        {/* Add form */}
        <AddHabitForm onAdd={addHabit} />

        {habits.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Add your first habit to get started 🚀
          </p>
        )}
      </div>
    </div>
  );
};

export default Index;
