"use client";

import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-coffee-500">
        <span className="font-medium">
          Question {current} of {total}
        </span>
        <motion.span
          key={percentage}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-coffee-700"
        >
          {percentage}% complete
        </motion.span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
