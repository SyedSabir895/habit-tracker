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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden rounded-lg border border-border bg-card p-4"
            onSubmit={handleSubmit}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Habit name..."
              autoFocus
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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

            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                Add Habit
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus size={16} /> Add New Habit
        </button>
      )}
    </div>
  );
};

export default AddHabitForm;
