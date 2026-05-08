"use client"
import { motion } from "framer-motion";

const MANTRAS = [
  "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्",
  "✦",
  "उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्",
  "✦",
  "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्",
  "✦",
  "उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्",
  "✦",
];

export default function TopBanner() {
  return (
    <div
      className="w-full h-9 overflow-hidden flex items-center relative"
      style={{
        background: "linear-gradient(90deg, #68020d 0%, #8b1a00 40%, #68020d 70%, #4a0109 100%)",
        borderBottom: "1px solid rgba(201,168,76,0.3)",
      }}
    >
      {/* Gold shimmer top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6) 30%, rgba(240,208,128,0.9) 50%, rgba(201,168,76,0.6) 70%, transparent)" }}
      />

      {/* Edge fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #68020d, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #68020d, transparent)" }} />

      {/* Scrolling text */}
      <motion.div
        className="flex items-center gap-6 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...MANTRAS, ...MANTRAS].map((item, i) => (
          <span
            key={i}
            className={item === "✦" ? "text-[#c9a84c] text-xs" : "text-[#f0d080] text-[11px] tracking-[2px]"}
            style={item !== "✦" ? { fontFamily: "'Noto Serif Devanagari', 'Noto Sans Devanagari', serif" } : {}}
          >
            {item}
          </span>
        ))}
      </motion.div>

      {/* Gold shimmer bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4) 50%, transparent)" }}
      />
    </div>
  );
}
