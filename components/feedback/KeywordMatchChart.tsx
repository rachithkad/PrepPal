import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import FadeIn from "@/components/FadeIn";

type KeywordMatchChartProps = {
  matched: number;
  missing: number;
};

const COLORS = ["#4ade80", "#f87171"];

export default function KeywordMatchChart({ matched, missing }: KeywordMatchChartProps) {
  const data = [
    { name: "Matched", value: matched },
    { name: "Missing", value: missing },
  ];

  return (
    <FadeIn duration={600}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-white">
              Keyword Match Overview
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={60}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      animationBegin={200}
                      animationDuration={1000}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} keywords`, name]}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        borderColor: '#374151',
                        borderRadius: '0.5rem',
                        color: '#f3f4f6'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
                  <div>
                    <h3 className="font-medium text-white">Matched Keywords</h3>
                    <p className="text-sm text-gray-400">
                      {matched} keywords found in your resume
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-400"></div>
                  <div>
                    <h3 className="font-medium text-white">Missing Keywords</h3>
                    <p className="text-sm text-gray-400">
                      {missing} keywords not found in your resume
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </FadeIn>
  );
}