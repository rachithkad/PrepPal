"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

type BarChartComponentProps = {
  data: { type: string; count: number }[];
};

export default function BarChartComponent({ data }: BarChartComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          layout="vertical" // Makes bars horizontal
        >
          <XAxis
            type="number"
            tick={{ fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            dataKey="type"
            type="category"
            width={100}
            tick={{ fill: '#6b7280' }}
            tickLine={{ stroke: 'transparent' }}
            axisLine={{ stroke: 'transparent' }}
          />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '0.75rem 1rem'
            }}
            itemStyle={{ color: '#111827' }}
            labelStyle={{
              fontWeight: 600,
              color: '#111827',
              marginBottom: '0.5rem'
            }}
            formatter={(value: number) => [`${value} interviews`, 'Count']}
            cursor={{ fill: '#e5e7eb', fillOpacity: 0.3 }}
          />
          <Bar
            dataKey="count"
            radius={[0, 4, 4, 0]} // Rounded corners on right side only
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{
                  filter: `drop-shadow(0 4px 6px ${COLORS[index % COLORS.length]}40)`
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}