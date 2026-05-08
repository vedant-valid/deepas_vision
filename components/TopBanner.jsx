"use client"
import { motion } from "framer-motion";

const ITEMS = [
  "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात् ॥",
];

// Doubled for seamless infinite loop
const DOUBLED = [...ITEMS, ...ITEMS];

export default function TopBanner() {
  return (
    <div className="w-full bg-[#0C0705] h-10 overflow-hidden flex items-center relative border-b border-amber-900/30">
      {/* Fade masks on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0C0705] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0C0705] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center gap-8 whitespace-nowrap px-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {DOUBLED.map((item, i) => (
          <span
            key={i}
            className="text-amber-400/85 text-sm tracking-widest"
            style={{ fontFamily: "'Noto Serif Devanagari', 'Noto Sans Devanagari', serif" }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
