import { useMemo, useEffect, useState } from "react";
import { Zap, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import HabitCard from "@/components/HabitCard";
import AddHabitForm from "@/components/AddHabitForm";
import { supabase } from "../supabaseClient";

interface Habit {
  id: number;
  habit_name: string;
  completed: boolean;
  icon: string | null;
  color: string | null;
  date?: string | null;
}

interface HabitLog {
  habit_id: number;
  date: string;
  completed: boolean;
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const getToday = () => new Date().toISOString().split("T")[0];

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

  const resetHabitsForToday = async () => {
    const today = getToday();
    const { error } = await supabase
      .from("habits")
      .update({ completed: false, date: today })
      .neq("date", today)
      .eq("completed", true);

    if (error) {
      console.error("Daily reset error:", error);
    }
  };

  const fetchHabits = async () => {
    const today = getToday();
    await resetHabitsForToday();

    const primaryQuery = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: false });

    if (!primaryQuery.error) {
      const baseHabits = (primaryQuery.data ?? []) as Habit[];
      const { data: todayLogs, error: logsError } = await supabase
        .from("habit_logs")
        .select("habit_id, date, completed")
        .eq("date", today);

      if (logsError) {
        setHabits(baseHabits);
        setFetchError(null);
        return;
      }

      const completedByHabit = new Map(
        ((todayLogs ?? []) as HabitLog[]).map((log) => [log.habit_id, log.completed])
      );
      const habitsWithTodayStatus = baseHabits.map((habit) => ({
        ...habit,
        completed: completedByHabit.get(habit.id) ?? false,
      }));
      setHabits(habitsWithTodayStatus);
      setFetchError(null);
      return;
    }

    // Fallback for tables that don't include created_at.
    const fallbackQuery = await supabase
      .from("habits")
      .select("*")
      .order("id", { ascending: false });

    if (fallbackQuery.error) {
      const message = fallbackQuery.error.message || primaryQuery.error.message;
      console.error("Fetch Error:", fallbackQuery.error);
      setFetchError(message);
      return;
    }

    const fallbackHabits = (fallbackQuery.data ?? []) as Habit[];
    const { data: todayLogs, error: logsError } = await supabase
      .from("habit_logs")
      .select("habit_id, date, completed")
      .eq("date", today);

    if (logsError) {
      setHabits(fallbackHabits);
      setFetchError(null);
      return;
    }

    const completedByHabit = new Map(
      ((todayLogs ?? []) as HabitLog[]).map((log) => [log.habit_id, log.completed])
    );
    const habitsWithTodayStatus = fallbackHabits.map((habit) => ({
      ...habit,
      completed: completedByHabit.get(habit.id) ?? false,
    }));
    setHabits(habitsWithTodayStatus);
    setFetchError(null);
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
    const today = getToday();
    const nextStatus = !currentStatus;
    const { error: logError } = await supabase.from("habit_logs").upsert(
      {
        habit_id: id,
        date: today,
        completed: nextStatus,
      },
      { onConflict: "habit_id,date" }
    );

    if (logError) {
      console.log("Log Update Error:", logError);
      return;
    }

    const { error } = await supabase
      .from("habits")
      .update({ completed: nextStatus, date: today })
    const { error } = await supabase
      .from("habits")
      .update({ completed: !currentStatus, date: today })
      .eq("id", id);

    if (error) console.log("Update Error:", error);
    fetchHabits();
  };

  // 📊 Quote logic
  const quote = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000);
    return QUOTES[day % QUOTES.length];
  }, []);

  // 📊 Progress calculation
  const completedToday = habits.filter((h) => h.completed).length;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-purple-50 transition-colors duration-500 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-900">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between rounded-[2rem] border border-white/40 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md dark:border-white/10 dark:bg-black/40"
        >
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-foreground">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20">
                <Zap size={24} fill="currentColor" />
              </span>
              Habits
            </h1>
            <p className="mt-2 font-medium text-muted-foreground">
              <span className="text-indigo-500 font-bold dark:text-indigo-400">{completedToday}</span> / {habits.length} completed today
            </p>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-muted-foreground shadow-sm ring-1 ring-black/5 transition-all hover:scale-110 hover:bg-white dark:bg-black/50 dark:ring-white/10 dark:hover:bg-black/80"
          >
            {dark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-500" />}
          </button>
        </motion.div>

        {/* Quote */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-[0_8px_30px_rgba(99,102,241,0.2)]"
        >
          <div className="absolute -right-4 -top-4 opacity-10">
            <Zap size={100} />
          </div>
          <p className="relative z-10 text-[15px] font-medium italic leading-relaxed text-white/90">"{quote}"</p>
        </motion.div>

        {/* Progress bar */}
        {habits.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="mb-3 flex justify-between text-sm font-bold text-muted-foreground px-1">
              <span>Daily Progress</span>
              <span className="text-indigo-500 dark:text-indigo-400">{Math.round((completedToday / habits.length) * 100)}%</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-black/5 shadow-inner dark:bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
                style={{
                  width: `${(completedToday / habits.length) * 100}%`,
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Habits List */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

        {fetchError && (
          <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
            Unable to fetch habits: {fetchError}
          </p>
        )}

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
