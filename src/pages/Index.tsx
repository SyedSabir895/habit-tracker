import { useMemo, useEffect, useState } from "react";
import { Zap, Sun, Moon } from "lucide-react";
import HabitCard from "@/components/HabitCard";
import AddHabitForm from "@/components/AddHabitForm";
import { supabase } from "../supabaseClient";

interface Habit {
  id: number;
  habit_name: string;
  completed: boolean;
  icon: string | null;
  color: string | null;
}

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
  const [habits, setHabits] = useState<Habit[]>([]);

  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  // 🌙 Theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // 📥 Fetch habits from Supabase
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Fetch Error:", error);
    } else {
      setHabits(data);
    }
  };

  // ➕ Add habit
  const addHabit = async (name: string, color: string, icon: string) => {
    const { error } = await supabase.from("habits").insert([
      {
        habit_name: name,
        color,
        icon,
        completed: false,
        date: new Date().toISOString().split("T")[0],
      },
    ]);

    if (error) console.log("Insert Error:", error);
    else fetchHabits();
  };

  // ❌ Delete habit
  const deleteHabit = async (id) => {
    const { error } = await supabase.from("habits").delete().eq("id", id);

    if (error) console.log("Delete Error:", error);
    else fetchHabits();
  };

  // ✅ Toggle complete
  const toggleToday = async (id, currentStatus) => {
    const { error } = await supabase
      .from("habits")
      .update({ completed: !currentStatus })
      .eq("id", id);

    if (error) console.log("Update Error:", error);
    else fetchHabits();
  };

  // 📊 Quote logic
  const quote = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000);
    return QUOTES[day % QUOTES.length];
  }, []);

  // 📊 Progress calculation
  const completedToday = habits.filter((h) => h.completed).length;

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
                style={{
                  width: `${(completedToday / habits.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Habits List */}
        <div className="mb-4 flex flex-col gap-3">
          {habits.map((habit, i) => (
            <HabitCard
              key={habit.id}
              name={habit.habit_name}
              icon={habit.icon ?? "🎯"}
              color={habit.color ?? "#3b82f6"}
              completed={habit.completed}
              streak={0}
              total={0}
              weekData={[]}
              onToggle={() => toggleToday(habit.id, habit.completed)}
              onDelete={() => deleteHabit(habit.id)}
              index={i}
            />
          ))}
        </div>

        {/* Add Habit */}
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