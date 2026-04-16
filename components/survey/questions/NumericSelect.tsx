"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface NumericSelectProps {
  options: string[];
  value: string | undefined;
  onChange: (value: string) => void;
}

export function NumericSelect({ options, value, onChange }: NumericSelectProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((option, index) => {
        const isSelected = value === option;
        return (
          <motion.button
            key={option}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.06, duration: 0.25 }}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "relative flex items-center justify-center p-4 rounded-2xl border-2 text-center transition-all duration-200",
              "hover:border-coffee-400 hover:bg-coffee-50 hover:scale-[1.02]",
              isSelected
                ? "border-coffee-600 bg-gradient-to-br from-coffee-50 to-cream-100 shadow-sm scale-[1.02]"
                : "border-coffee-100 bg-white"
            )}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-coffee-600 flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </motion.div>
            )}
            <span
              className={cn(
                "text-sm font-medium leading-snug transition-colors",
                isSelected ? "text-coffee-900" : "text-coffee-600"
              )}
            >
              {option}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
