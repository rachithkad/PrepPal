import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FiCheckCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";

type FeedbackItem = {
  type: "strengths" | "weaknesses" | "suggestions";
  items: string[];
};

export default function FeedbackSection({ type, items }: FeedbackItem) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const config = {
    strengths: {
      icon: <FiCheckCircle className="text-2xl text-emerald-400" />,
      title: "Strengths",
      color: "emerald",
    },
    weaknesses: {
      icon: <FiAlertTriangle className="text-2xl text-red-400" />,
      title: "Weaknesses",
      color: "red",
    },
    suggestions: {
      icon: <FiInfo className="text-2xl text-blue-400" />,
      title: "Suggestions",
      color: "blue",
    },
  };

  return (
    <motion.div variants={fadeIn}>
      <Card className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-${config[type].color}-500/10 transition-all ${type === "suggestions" ? "h-full" : ""}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {config[type].icon}
            <h3 className="text-xl font-semibold text-white">
              {config[type].title}
            </h3>
          </div>
          
          {type === "suggestions" ? (
            <ul className="space-y-4">
              {items.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-colors"
                >
                  <span className="text-gray-300">{point}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-3">
              {items.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-gray-300"
                >
                  <span className={`text-${config[type].color}-400 mt-1`}>•</span>
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}