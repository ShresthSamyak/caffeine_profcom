"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

interface SideEffectsChartProps {
  data: { name: string; count: number }[];
  delay?: number;
}

export function SideEffectsChart({ data, delay = 0 }: SideEffectsChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const normalized = data.map((d) => ({
    ...d,
    value: Math.round((d.count / maxCount) * 100),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl border border-coffee-100 p-6 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-coffee-900">
          Side Effects Distribution
        </h3>
        <p className="text-xs text-coffee-400 mt-0.5">
          Relative frequency of reported side effects
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={normalized}>
          <PolarGrid stroke="#F5CEAB" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fontSize: 9, fill: "#7D3A1A" }}
          />
          <Radar
            name="Side Effects"
            dataKey="value"
            stroke="#C9622F"
            fill="#C9622F"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #F5CEAB",
              fontSize: "12px",
            }}
            formatter={(v: number) => [`${v}%`, "Relative freq."]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
