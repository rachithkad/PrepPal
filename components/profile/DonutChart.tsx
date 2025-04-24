"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', 
  '#f43f5e', '#f59e0b', '#10b981',
  '#3b82f6', '#a855f7', '#ef4444'
];

type DonutChartComponentProps = {
  data: { tech: string; value: number }[];
};

export default function DonutChartComponent({ data }: DonutChartComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="tech"
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={2}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '0.75rem 1rem'
            }}
            itemStyle={{ color: '#111827' }}
            formatter={(value: number, name: string) => [`${value} uses`, name]}
          />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: '20px'
            }}
            formatter={(value, entry, index) => (
              <span className="text-sm text-gray-600">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}