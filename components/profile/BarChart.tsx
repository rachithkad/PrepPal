"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type BarChartComponentProps = {
  data: { type: string; count: number }[];
};

export default function BarChartComponent({ data }: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#a97455" />
      </BarChart>
    </ResponsiveContainer>
  );
}
