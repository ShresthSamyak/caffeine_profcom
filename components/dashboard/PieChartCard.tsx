"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface DataItem {
  name: string;
  value: number;
}

interface PieChartCardProps {
  title: string;
  subtitle?: string;
  data: DataItem[];
  delay?: number;
}

const COLORS = [
  "#C9622F",
  "#A84E24",
  "#E88C55",
  "#7D3A1A",
  "#EFB080",
  "#552710",
  "#F5CEAB",
  "#2D1508",
];

const RADIAN = Math.PI / 180;

function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight="600"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function PieChartCard({ title, subtitle, data, delay = 0 }: PieChartCardProps) {
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
