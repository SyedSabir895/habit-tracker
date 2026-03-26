import { motion } from "framer-motion";
import { Flame, Check, Trash2 } from "lucide-react";

interface WeekDay {
  date: string;
  completed: boolean;
  day: string;
}

interface HabitCardProps {
  name: string;
  icon: string;
  color: string;
  completed: boolean;
  streak: number;
  total: number;
  weekData: WeekDay[];
  onToggle: () => void;
  onDelete: () => void;
  index: number;
}

const HabitCard = ({
  name,
  icon,
  color,
  completed,
  streak,
  total,
  weekData,
  onToggle,
  onDelete,
  index,
}: HabitCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, type: "spring", bounce: 0.3 }}
      className={`group relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-[2rem] border p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        completed 
          ? "border-emerald-500/20 bg-emerald-50/50 shadow-emerald-500/10 dark:bg-emerald-950/20" 
          : "border-white/40 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-black/40"
      }`}
    >
      <button
        onClick={onDelete}
        className="absolute right-4 top-4 z-10 rounded-full bg-destructive/10 p-2 text-destructive opacity-0 transition-all hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
        aria-label="Delete habit"
      >
        <Trash2 size={16} />
      </button>

      <div className="flex flex-col items-start gap-4">
        <button
          onClick={onToggle}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg transition-all active:scale-90 hover:scale-110 cursor-pointer"
          style={{ 
            backgroundColor: completed ? color : undefined,
            borderWidth: completed ? 0 : 2,
            borderColor: completed ? undefined : "currentColor",
            borderStyle: completed ? undefined : "solid"
          }}
          aria-label={completed ? "Mark incomplete" : "Mark complete"}
        >
          {completed ? (
            <motion.div
              key="check"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-primary-foreground"
            >
              <Check size={20} strokeWidth={3} />
            </motion.div>
          ) : (
            <motion.span
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              className="flex h-full w-full items-center justify-center rounded-lg text-base"
            >
              {icon}
            </motion.span>
          )}
        </button>

        <div className="mt-2 min-w-0 w-full">
          <h3
            className={`font-display text-xl font-extrabold leading-tight transition-colors truncate ${
              completed ? "text-muted-foreground line-through opacity-70" : "text-foreground"
            }`}
          >
            {name}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
            {streak > 0 && (
              <span className="flex items-center gap-1 font-bold text-streak px-2.5 py-1 rounded-full bg-streak/10">
                <Flame size={14} /> {streak}d
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5">{total} total</span>
          </div>
        </div>
      </div>

      {/* Weekly grid */}
      {weekData && weekData.length > 0 && (
        <div className="mt-auto flex w-full shrink-0 gap-1.5 rounded-2xl bg-black/[0.04] p-3 dark:bg-white/[0.04]">
          {weekData.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`h-3 w-full rounded-full transition-all duration-300 ${!d.completed && "bg-black/10 dark:bg-white/10"}`}
                style={{ 
                  backgroundColor: d.completed ? color : undefined, 
                  boxShadow: d.completed ? `0 0 10px ${color}60` : undefined 
                }}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{d.day}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HabitCard;
