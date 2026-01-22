import React from "react";

interface ScoreBadgeProps {
  score: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const numericScore = parseInt(score.replace("%", ""), 10);

  let bgColor = "bg-red-900 border-red-500 text-red-200";
  if (numericScore >= 80) {
    bgColor = "bg-green-900 border-green-500 text-green-200";
  } else if (numericScore >= 60) {
    bgColor = "bg-yellow-900 border-yellow-500 text-yellow-200";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold border ${bgColor}`}
    >
      {score}
    </span>
  );
};
