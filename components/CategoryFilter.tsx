"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

const categoryShadowColors: Record<string, string> = {
  research: "#3b82f6",
  development: "#8b5cf6",
  devops: "#10b981",
  data: "#06b6d4",
  communication: "#ec4899",
  automation: "#f59e0b",
  productivity: "#6366f1",
};

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  const baseClasses =
    "px-3.5 py-1.5 rounded-sm text-sm font-medium border border-black bg-white text-black hover:-translate-x-px hover:-translate-y-px active:shadow-brutal-active active:translate-x-0 active:translate-y-0";

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <button
        onClick={() => onSelect(null)}
        className={`${baseClasses} capitalize`}
        style={{
          boxShadow:
            selected === null
              ? "2px 2px 0 #f97316"
              : "2px 2px 0 #000",
        }}
        onMouseEnter={(e) => {
          if (selected !== null)
            e.currentTarget.style.boxShadow = "3px 3px 0 #f97316";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow =
            selected === null ? "2px 2px 0 #f97316" : "2px 2px 0 #000";
        }}
      >
        All
      </button>
      {categories.map((cat) => {
        const color = categoryShadowColors[cat] || "#9ca3af";
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat === selected ? null : cat)}
            className={`${baseClasses} capitalize`}
            style={{
              boxShadow: isActive
                ? `2px 2px 0 ${color}`
                : "2px 2px 0 #000",
            }}
            onMouseEnter={(e) => {
              if (!isActive)
                e.currentTarget.style.boxShadow = `3px 3px 0 ${color}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = isActive
                ? `2px 2px 0 ${color}`
                : "2px 2px 0 #000";
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
