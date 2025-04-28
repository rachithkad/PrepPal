import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

type KeywordListProps = {
  type: "matched" | "missing";
  keywords: string[];
};

export default function KeywordList({ type, keywords }: KeywordListProps) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={fadeIn}>
      <Card className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-${type === "matched" ? "emerald" : "red"}-500/10 transition-all`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {type === "matched" ? (
              <FiCheckCircle className="text-2xl text-emerald-400" />
            ) : (
              <FiAlertTriangle className="text-2xl text-red-400" />
            )}
            <h3 className="text-xl font-semibold text-white">
              {type === "matched" ? "Matched Keywords" : "Missing Keywords"}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`inline-block px-3 py-1 ${type === "matched" ? "bg-emerald-900/50 text-emerald-300 border-emerald-800/50" : "bg-red-900/50 text-red-300 border-red-800/50"} rounded-full text-sm border`}
              >
                {kw}
              </motion.span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}