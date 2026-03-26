import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "#e8614d", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899",
  "#f43f5e", "#0ea5e9", "#22c55e", "#a855f7", "#fb923c", "#14b8a6",
];

const EMOJI_CATEGORIES = {
  "Sports & Fitness": ["🏃", "💪", "🏋️", "🤸", "🧘", "🚴", "⛹️", "🤾", "🏊", "🤺", "⛷️", "🏄", "🚣", "🏇"],
  "Study & Learning": ["📖", "📚", "✍️", "🎓", "📝", "🧠", "💡", "🔬", "🎨", "🎭", "🎬", "🎵", "🎸", "🎹"],
  "Health & Wellness": ["💧", "🍎", "🥗", "🧘", "🛏️", "🏥", "💊", "🫀", "📊", "⚖️", "🏃", "🚴", "🧪"],
  "Food & Nutrition": ["🍎", "🥕", "🥦", "🍊", "🍌", "🥑", "🥛", "🍯", "🥤", "☕", "🍵", "🧂", "🍽️"],
  "Work & Productivity": ["💼", "📊", "📈", "💻", "🖥️", "📱", "⏰", "✅", "📋", "📌", "🎯", "🚀", "⚙️"],
  "Creative": ["🎨", "🖌️", "🖍️", "✏️", "📐", "🎭", "🎬", "📷", "📸", "🎥", "🎞️", "🎪", "🎨"],
  "Mindfulness": ["🧘", "🕉️", "☮️", "💆", "🛀", "🌸", "🌺", "🌻", "🌷", "🌹", "🍃", "🌿", "☘️"],
  "Goals & Achievements": ["🎯", "🏆", "🥇", "🥈", "🥉", "🎖️", "👑", "💎", "⭐", "✨", "🌟", "💫", "🚀"],
  "Fun & Hobbies": ["🎮", "🎲", "🎯", "🎪", "🎭", "🎨", "🎬", "🎤", "🎧", "🎸", "🎹", "🎺", "🎻"],
  "Nature": ["🌱", "🌿", "🍀", "🌳", "🌲", "🌴", "🌵", "🌾", "🌻", "🌺", "🌸", "🌷", "🌹", "🌼"],
  "Animals": ["🐕", "🐈", "🐇", "🦆", "🦅", "🦉", "🐢", "🐌", "🐝", "🦋", "🐛", "🐞", "🦗"],
  "Daily Habits": ["🛏️", "🚿", "🪥", "👕", "👟", "🧴", "🧼", "🧽", "🧹", "🧺", "🧻", "📅"]
};

const ALL_ICONS = Object.values(EMOJI_CATEGORIES).flat();

interface AddHabitFormProps {
  onAdd: (name: string, color: string, icon: string) => void;
}

const AddHabitForm = ({ onAdd }: AddHabitFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ALL_ICONS[0]);
  const [selectedCategory, setSelectedCategory] = useState("Sports & Fitness");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), color, icon);
    setName("");
    setOpen(false);
  };

  return (
    <div>
      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="mb-6 overflow-hidden rounded-[2rem] border border-white/40 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/60"
            onSubmit={handleSubmit}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What do you want to build?"
              autoFocus
              className="w-full rounded-2xl border-none bg-black/5 px-5 py-4 text-lg font-bold text-foreground placeholder:text-muted-foreground/60 transition-all focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:bg-white/5 dark:focus:bg-black/50"
            />

            <div className="mt-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Categories</p>
              <div className="mb-3 flex flex-wrap gap-1">
                {Object.keys(EMOJI_CATEGORIES).map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-md px-2 py-1 text-xs transition-all ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Select Icon</p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto rounded-md border border-border bg-background p-2">
                {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES]?.map((i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setIcon(i)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-base transition-all ${
                      icon === i ? "ring-2 ring-ring scale-110 bg-secondary" : "hover:bg-secondary"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Color</p>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-6 w-6 rounded-full transition-transform ${
                      color === c ? "scale-125 ring-2 ring-ring ring-offset-2 ring-offset-card" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/30 active:scale-95"
              >
                Spark Habit ✨
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-black/5 px-8 py-4 text-base font-bold text-muted-foreground transition-all hover:bg-black/10 hover:text-foreground dark:bg-white/5 dark:hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(true)}
          className="group flex w-full items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed border-indigo-300 bg-indigo-50/50 py-5 text-base font-bold text-indigo-600 shadow-sm transition-all hover:border-indigo-400 hover:bg-indigo-100 hover:shadow-md dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/20"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-200 text-indigo-700 transition-transform group-hover:scale-110 group-hover:rotate-90 dark:bg-indigo-900/50 dark:text-indigo-300">
            <Plus size={24} strokeWidth={3} />
          </div>
          Create New Habit
        </motion.button>
      )}
    </div>
  );
};

export default AddHabitForm;
