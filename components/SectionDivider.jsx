"use client"
import { motion } from "framer-motion";

const STARS = [
  { left: "5%",  top: "55%", size: 4,   delay: 0    },
  { left: "14%", top: "38%", size: 3,   delay: 0.35 },
  { left: "25%", top: "62%", size: 5,   delay: 0.7  },
  { left: "37%", top: "35%", size: 3,   delay: 0.15 },
  { left: "50%", top: "52%", size: 6,   delay: 1.0  },
  { left: "63%", top: "40%", size: 3,   delay: 0.55 },
  { left: "74%", top: "60%", size: 4,   delay: 0.85 },
  { left: "86%", top: "36%", size: 3,   delay: 0.25 },
  { left: "95%", top: "56%", size: 4,   delay: 0.65 },
];

export default function SectionDivider() {
  return (
    <div className="relative w-full h-20 overflow-hidden pointer-events-none select-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Wave stroke gradient */}
          <linearGradient id="dvStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="transparent" />
            <stop offset="15%"  stopColor="#C9A84C" stopOpacity="0.9" />
            <stop offset="50%"  stopColor="#991B1B" stopOpacity="0.7"  />
            <stop offset="85%"  stopColor="#C9A84C" stopOpacity="0.9" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Subtle fill under wave */}
          <linearGradient id="dvFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="dvGlow" x="-10%" y="-100%" width="120%" height="400%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Filled area beneath wave */}
        <motion.path
          d="M0,40 C180,20 360,60 540,40 C720,20 900,60 1080,40 C1260,20 1380,50 1440,40 L1440,80 L0,80 Z"
          fill="url(#dvFill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-10px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Main wave stroke */}
        <motion.path
          d="M0,40 C180,20 360,60 540,40 C720,20 900,60 1080,40 C1260,20 1380,50 1440,40"
          fill="none"
          stroke="url(#dvStroke)"
          strokeWidth="2.5"
          filter="url(#dvGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-10px" }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      </svg>

      {/* Shooting comet */}
      <motion.div
        className="absolute h-[3px] w-20 rounded-full"
        style={{
          top: "47%",
          background: "linear-gradient(to right, transparent, #D4AF37 40%, #fff8 60%, transparent)",
          filter: "blur(1px)",
        }}
        initial={{ left: "-8%", opacity: 0 }}
        animate={{ left: "108%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3.8, ease: "easeInOut" }}
      />

      {/* Twinkling stars */}
      {STARS.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-400"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            boxShadow: `0 0 ${star.size * 2}px rgba(201,168,76,0.8)`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.6, 0.4] }}
          transition={{ duration: 2.2, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Centre ✦ */}
      <motion.span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 text-lg"
        style={{ textShadow: "0 0 12px rgba(201,168,76,0.9)" }}
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.2, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        ✦
      </motion.span>
    </div>
  );
}
