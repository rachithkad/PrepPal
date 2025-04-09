"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type DonutChartComponentProps = {
  data: { tech: string; value: number }[];
};

const COLORS = ["#c49a6c", "#a97455", "#6b4f2c", "#d2b48c", "#deb887", "#e1c699"];

export default function DonutChartComponent({ data }: DonutChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Tooltip />
        <Pie
          data={data}
          dataKey="value"
          nameKey="tech"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
