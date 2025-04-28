import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const childFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FeedbackHeader() {
  return (
    <FadeIn duration={200}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div variants={childFadeIn}>
          <h1 className="text-4xl text-center md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-3">
            Resume Feedback
          </h1>
        </motion.div>
      </motion.div>
    </FadeIn>
  );
}