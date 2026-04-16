"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LikertScaleProps {
  value: number | undefined;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  min?: number;
  max?: number;
}

const scaleLabels: Record<number, string> = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree",
};

const scaleColors: Record<number, string> = {
  1: "border-red-400 bg-red-50 text-red-700",
  2: "border-orange-400 bg-orange-50 text-orange-700",
  3: "border-amber-400 bg-amber-50 text-amber-700",
  4: "border-lime-400 bg-lime-50 text-lime-700",
  5: "border-green-400 bg-green-50 text-green-700",
};

const scaleSelectedColors: Record<number, string> = {
  1: "border-red-500 bg-red-500 text-white shadow-lg shadow-red-200",
  2: "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200",
  3: "border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-200",
  4: "border-lime-500 bg-lime-500 text-white shadow-lg shadow-lime-200",
  5: "border-green-500 bg-green-500 text-white shadow-lg shadow-green-200",
};

export function LikertScale({
  value,
  onChange,
  minLabel = "Strongly Disagree",
  maxLabel = "Strongly Agree",
  min = 1,
  max = 5,
}: LikertScaleProps) {
  const scale = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <div className="space-y-6">
      <div className="flex gap-3 justify-center">
        {scale.map((num, index) => {
          const isSelected = value === num;
          return (
            <motion.button
              key={num}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.07, duration: 0.25 }}
              type="button"
              onClick={() => onChange(num)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center",
                "h-16 md:h-20 rounded-2xl border-2 transition-all duration-200",
                "hover:scale-105 active:scale-95",
                isSelected
                  ? scaleSelectedColors[num]
                  : "border-coffee-200 bg-white text-coffee-600 hover:border-coffee-400 hover:bg-coffee-50"
              )}
            >
              <span className="text-xl font-bold">{num}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-coffee-500 px-1">
        <span className="max-w-[100px] text-left">{minLabel}</span>
        <span className="max-w-[100px] text-right">{maxLabel}</span>
      </div>

      {value !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className={cn(
            "inline-block px-4 py-1.5 rounded-full text-sm font-medium border-2",
            scaleColors[value]
          )}>
            {scaleLabels[value]}
          </span>
        </motion.div>
      )}
    </div>
  );
}
