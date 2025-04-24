"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

type LineChartComponentProps = {
  data: { date: string; score: number }[];
};

export default function LineChartComponent({ data }: LineChartComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height={270}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickMargin={10}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickMargin={10}
          />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '0.5rem 1rem'
            }}
            itemStyle={{ color: '#111827' }}
            labelStyle={{
              fontWeight: 600,
              color: '#111827',
              marginBottom: '0.5rem'
            }}
            formatter={(value: number) => [`${value}%`, 'Score']}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              });
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ 
              r: 5, 
              fill: '#4f46e5',
              stroke: '#fff',
              strokeWidth: 2
            }}
            activeDot={{ 
              r: 8, 
              fill: '#4f46e5',
              stroke: '#fff',
              strokeWidth: 2
            }}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}