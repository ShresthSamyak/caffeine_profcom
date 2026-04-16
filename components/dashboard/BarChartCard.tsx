"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface BarChartCardProps {
  title: string;
  subtitle?: string;
  data: { name: string; responses: number; avgProductivity: number }[];
  delay?: number;
}

export function BarChartCard({ title, subtitle, data, delay = 0 }: BarChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl border border-coffee-100 p-6 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-coffee-900">{title}</h3>
        {subtitle && (
          <p className="text-xs text-coffee-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F5CEAB" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#7D3A1A" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis tick={{ fontSize: 10, fill: "#7D3A1A" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #F5CEAB",
              fontSize: "12px",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", color: "#7D3A1A" }}
          />
          <Bar
            dataKey="responses"
            name="Responses"
            fill="#C9622F"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="avgProductivity"
            name="Avg Productivity Score"
            fill="#EFB080"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
