"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "from-coffee-500 to-coffee-700",
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl border border-coffee-100 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-coffee-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-coffee-950">{value}</p>
          {subtitle && (
            <p className="text-xs text-coffee-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
