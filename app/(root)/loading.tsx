"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Steam animation */}
        <div className="absolute -top-14 flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-[2px] h-6 bg-[#d2b48c] rounded-full opacity-50"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: -12, opacity: 1 }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.25,
              }}
            />
          ))}
        </div>

        {/* Coffee cup */}
        <div className="relative w-16 h-14 bg-[#c49a6c] rounded-b-[50%] shadow-md">
          {/* Cup handle */}
          <div className="absolute -right-4 top-2 w-4 h-7 border-2 border-[#c49a6c] rounded-full" />
        </div>

        {/* Text */}
        <p className="mt-6 text-[#6b4f2c] text-sm font-medium">
          Brewing your experience...
        </p>
      </div>
    </div>
  );
}
