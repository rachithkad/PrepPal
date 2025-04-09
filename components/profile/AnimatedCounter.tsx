"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

type AnimatedCounterProps = {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
};

const AnimatedCounter = ({
  from = 0,
  to,
  duration = 1,
  suffix = "",
}: AnimatedCounterProps) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (v) => setDisplay(v));

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, to, duration]);

  return <motion.span>{display + suffix}</motion.span>;
};

export default AnimatedCounter;
