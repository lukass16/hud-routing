"use client";

interface ConfidenceBadgeProps {
  score: number;
}

export default function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  const percentage = Math.round(score * 100);

  let color: string;
  if (percentage >= 80) {
    color = "text-green-700 bg-green-50 border-green-200";
  } else if (percentage >= 50) {
    color = "text-amber-700 bg-amber-50 border-amber-200";
  } else {
    color = "text-gray-500 bg-gray-50 border-gray-200";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
    >
      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
        <circle
          cx="6"
          cy="6"
          r="5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={`${(percentage / 100) * 31.4} 31.4`}
          transform="rotate(-90 6 6)"
          className="opacity-80"
        />
      </svg>
      {percentage}% match
    </span>
  );
}
