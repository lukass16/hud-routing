"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <button
        onClick={() => onSelect(null)}
        className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
          selected === null
            ? "bg-foreground text-background border-foreground"
            : "bg-card text-muted border-border hover:border-foreground/30 hover:text-foreground"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat === selected ? null : cat)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium border capitalize transition-all ${
            selected === cat
              ? "bg-foreground text-background border-foreground"
              : "bg-card text-muted border-border hover:border-foreground/30 hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
