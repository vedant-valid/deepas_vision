"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionDivider from "@/components/SectionDivider";

const TESTIMONIALS = [
  {
    name: "Pallavi",
    role: "Manager, Taj Hotels",
    initial: "P",
    text: "I was completely lost about my career direction. After my session with Deepa ji, everything became so clear. She explained my chart in a way no one ever had — it felt like she was reading my life. I didn't believe in remedies before, but now I truly do. Grateful from the bottom of my heart. 🙏",
  },
  {
    name: "Riya Gandhi",
    role: "Psychology Student",
    initial: "R",
    text: "I came with confusion about my future and left with a roadmap. Deepa ji connected my chart to real situations in my life — it was accurate to the point of being emotional. She is not just an astrologer, she is a guide. I feel so much more confident now.",
  },
  {
    name: "Ram Bhardwaj",
    role: "Business Owner",
    initial: "R",
    text: "My business was at a standstill and I was about to take a huge financial risk. Deepa ji's session literally saved me from a wrong decision. She saw what I couldn't. The clarity she gave me about timing and partnerships was invaluable. Highly recommend to every entrepreneur. ❤️",
  },
  {
    name: "Manoj",
    role: "Actor",
    initial: "M",
    text: "I've met many astrologers in my life but Deepa ji is different. She speaks logic, not fear. Her reading of my planetary periods was spot on and she gave me the courage to focus on what I do best during my Sade Sati. She truly changed how I see astrology.",
  },
  {
    name: "Shubhasish",
    role: "Software Engineer",
    initial: "S",
    text: "The session was nothing like I expected — in the best way possible. Deepa ji explained complex astrological concepts so simply and mapped them directly to my career struggles. The accuracy was unbelievable. I finally understand why certain periods of my life were so difficult. Thank you! 🌟",
  },
  {
    name: "Devika",
    role: "Homemaker",
    initial: "D",
    text: "I was going through a very difficult phase in my marriage and family life. Deepa ji listened patiently and then showed me exactly what my chart said about the timing and the way forward. I didn't feel judged — I felt understood. She gave me hope and a practical plan. Forever grateful.",
  },
];

const VISIBLE = 3;

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const total = TESTIMONIALS.length;

  function goTo(index, dir = 1) {
    setDirection(dir);
    setCurrent((index + total) % total);
  }

  function next() { goTo(current + 1, 1); }
  function prev() { goTo(current - 1, -1); }

  useEffect(() => {
    timerRef.current = setInterval(() => { goTo(current + 1, 1); }, 4000);
    return () => clearInterval(timerRef.current);
  }, [current]);

  // Which 3 to show
  const visible = Array.from({ length: VISIBLE }, (_, i) =>
    TESTIMONIALS[(current + i) % total]
  );

  return (
    <section id="bharosa" className="relative overflow-hidden bg-[#fffaf5]">
      <SectionDivider />

      {/* Decorative top border strip */}
      <div className="w-full h-6 overflow-hidden" style={{
        background: "repeating-linear-gradient(90deg, #68020d 0px, #68020d 10px, #c9802e 10px, #c9802e 20px, #68020d 20px, #68020d 30px, #fffaf5 30px, #fffaf5 34px)",
        opacity: 0.85,
      }} />

      {/* Ornate frame */}
      <div className="relative mx-4 md:mx-10 my-0 border-2 border-[#c9802e]/60 bg-[#fffdf8]"
        style={{ boxShadow: "0 0 0 6px rgba(201,128,46,0.10), inset 0 0 0 2px rgba(201,128,46,0.08)" }}>

        {/* Corner ornaments */}
        {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos, i) => (
          <span key={i} className={`absolute ${pos} text-[#c9802e]/60 text-xl leading-none pointer-events-none`}>✦</span>
        ))}

        <div className="px-6 md:px-14 py-12">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-xs text-[#68020d]/40 uppercase tracking-[4px] mb-3">Client Experiences</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#68020d]"
              style={{ fontFamily: "var(--font-cinzel)" }}>
              Life Changing Stories
            </h2>
            <div className="flex justify-center mt-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#c9802e] to-transparent" />
            </div>
          </motion.div>

          {/* Cards — desktop 3, mobile 1 */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {visible.map((t, i) => (
                  <div
                    key={t.name + i}
                    className="relative rounded-sm p-6 flex flex-col gap-4"
                    style={{
                      background: "linear-gradient(135deg, #f5e6c8 0%, #ede0c0 50%, #e8d5a8 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 12px rgba(104,2,13,0.08)",
                      border: "1px solid rgba(201,128,46,0.3)",
                    }}
                  >
                    {/* Quote mark */}
                    <span className="text-5xl text-[#68020d]/15 font-serif leading-none -mb-3 select-none">&ldquo;</span>

                    {/* Text */}
                    <p className="text-[#3d1a0a] text-sm leading-relaxed flex-1">
                      {t.text}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-3 border-t border-[#c9802e]/20">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#68020d] to-[#9c2020] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {t.initial}
                      </div>
                      <div>
                        <p className="text-[#68020d] font-semibold text-sm leading-none">{t.name}</p>
                        <p className="text-[#9c6b2e] text-xs mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full border border-[#c9802e]/40 text-[#68020d] hover:bg-[#68020d] hover:text-white hover:border-[#68020d] transition-all duration-200 flex items-center justify-center text-sm"
            >
              ‹
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "w-6 h-2 bg-[#68020d]" : "w-2 h-2 bg-[#c9802e]/30 hover:bg-[#c9802e]/60"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-8 h-8 rounded-full border border-[#c9802e]/40 text-[#68020d] hover:bg-[#68020d] hover:text-white hover:border-[#68020d] transition-all duration-200 flex items-center justify-center text-sm"
            >
              ›
            </button>
          </div>

        </div>
      </div>

      {/* Decorative bottom border strip */}
      <div className="w-full h-6 overflow-hidden mt-0" style={{
        background: "repeating-linear-gradient(90deg, #68020d 0px, #68020d 10px, #c9802e 10px, #c9802e 20px, #68020d 20px, #68020d 30px, #fffaf5 30px, #fffaf5 34px)",
        opacity: 0.85,
      }} />
    </section>
  );
}
