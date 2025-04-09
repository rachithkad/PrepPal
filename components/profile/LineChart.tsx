"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type LineChartComponentProps = {
  data: { date: string; score: number }[];
};

export default function LineChartComponent({ data }: LineChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#6b4f2c" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
