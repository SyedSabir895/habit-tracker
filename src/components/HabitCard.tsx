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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-lg"
    >
      <button
        onClick={onDelete}
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        aria-label="Delete habit"
      >
        <Trash2 size={14} />
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg transition-transform active:scale-90"
          style={{ backgroundColor: completed ? color : undefined }}
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
            <span
              className="flex h-full w-full items-center justify-center rounded-lg border-2 border-border text-base"
            >
              {icon}
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={`font-display text-sm font-semibold leading-tight ${
              completed ? "text-muted-foreground line-through" : "text-card-foreground"
            }`}
          >
            {name}
          </h3>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            {streak > 0 && (
              <span className="flex items-center gap-0.5 font-medium text-streak">
                <Flame size={12} /> {streak}d
              </span>
            )}
            <span>{total} total</span>
          </div>
        </div>
      </div>

      {/* Weekly grid */}
      <div className="mt-3 flex gap-1">
        {weekData.map((d) => (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="h-2 w-full rounded-sm transition-colors"
              style={{ backgroundColor: d.completed ? color : undefined }}
              // fallback for non-completed
            >
              {!d.completed && (
                <div className="h-full w-full rounded-sm bg-chart-empty" />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HabitCard;
