"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface MultipleChoiceProps {
  options: string[];
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

export function MultipleChoice({ options, value = [], onChange }: MultipleChoiceProps) {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = value.includes(option);
        return (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
            type="button"
            onClick={() => toggle(option)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200",
              "hover:border-coffee-400 hover:bg-coffee-50",
              isSelected
                ? "border-coffee-600 bg-coffee-50 shadow-sm"
                : "border-coffee-100 bg-white"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
                isSelected
                  ? "border-coffee-600 bg-coffee-600"
                  : "border-coffee-300"
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isSelected ? "text-coffee-900" : "text-coffee-700"
              )}
            >
              {option}
            </span>
          </motion.button>
        );
      })}
      {value.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-coffee-500 text-center pt-1"
        >
          {value.length} selected
        </motion.p>
      )}
    </div>
  );
}
