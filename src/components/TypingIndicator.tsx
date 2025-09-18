"use client";
import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 p-3">
      <motion.svg
        width="60"
        height="20"
        viewBox="0 0 60 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M0 10 Q 15 0, 30 10 T 60 10"
          fill="transparent"
          stroke="url(#black)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87379A" />
            <stop offset="100%" stopColor="#002395" />
          </linearGradient>
        </defs>
      </motion.svg>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Jordy tippt …
      </span>
    </div>
  );
}
