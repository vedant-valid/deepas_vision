"use client"
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionDivider from "@/components/SectionDivider";
import { UserCheck, BookOpenCheck, BrainCircuit, Map } from 'lucide-react';

const CARDS = [
  {
    number: "01",
    title: "1:1 Strategic Session",
    content: "A calm, focused discussion that works on the formula — Session = Strategy + Direction – (Chaos × Doubts). No guesswork, just clarity.",
    icon: <UserCheck className="w-7 h-7" />,
    tag: "Foundation",
  },
  {
    number: "02",
    title: "Astrology as a Science",
    content: "Answering your unlimited questions with proper logic & methods. Astrology is not a ₹5/min thing — it is a science of patterns and time.",
    icon: <BookOpenCheck className="w-7 h-7" />,
    tag: "Insight",
  },
  {
    number: "03",
    title: "The दीक्षा Process",
    content: "Deep study of your 9 charts + Numerology + Time periods. Every layer of your life analysed with precision and care.",
    icon: <BrainCircuit className="w-7 h-7" />,
    tag: "Analysis",
  },
  {
    number: "04",
    title: "From Possibility to Plan",
    content: "After a fulfilled session we look among all choices, opportunities & fields and map your most aligned path forward.",
    icon: <Map className="w-7 h-7" />,
    tag: "Direction",
  },
];

function StickyCard({ card, scrollYProgress, index, total }) {
  const start = index / total;
  const end   = (index + 1) / total;
  const y     = useTransform(scrollYProgress, [start, end], [60, 0]);
  const opacity = useTransform(scrollYProgress, [start, Math.min(end + 0.05, 1)], [0.4, 1]);

  return (
    <motion.div
      className="sticky top-24 mb-6"
      style={{ y, opacity }}
    >
      <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Card header strip */}
        <div className="bg-gradient-to-r from-red-800 to-red-700 px-6 py-4 flex items-center justify-between">
          <span className="text-white/50 text-4xl font-black leading-none">{card.number}</span>
          <span className="text-white/80 text-xs tracking-[3px] uppercase">{card.tag}</span>
          <div className="text-white/70">{card.icon}</div>
        </div>

        {/* Card body */}
        <div className="px-6 py-6">
          <h3 className="text-xl font-bold text-red-800 mb-3">{card.title}</h3>
          <p className="text-gray-600 leading-relaxed">{card.content}</p>

          {/* Decorative dots */}
          <div className="flex gap-1.5 mt-6">
            {CARDS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-red-800' : 'w-1.5 bg-red-200'}`} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowWorks() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <>
      <div id="about"><SectionDivider /></div>

      <div ref={containerRef} className="relative bg-[#fffaf5]">

        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(#68020d 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-16">

          {/* Left sticky panel */}
          <div className="w-full md:w-2/5 md:sticky md:top-24 md:self-start">
            <motion.div style={{ y: titleY }}>

              {/* Label */}
              <p className="text-xs text-red-800/50 uppercase tracking-[4px] mb-4">The Process</p>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-bold text-red-800 leading-tight mb-6">
                How Deepa&apos;s<br />
                <span className="italic font-normal">shiksha</span> works?
              </h2>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                With years of experience in{" "}
                <span className="font-semibold text-red-700">वैदिक Astrology</span>,{" "}
                <span className="font-semibold text-red-700">Numerology</span>, and{" "}
                <span className="font-semibold text-red-700">Lal Kitab</span>, Deepa&apos;s Vision offers
                कर्मिक उपाय and guides you toward the right करियर and जीवन मार्ग — not through भय, but with clarity.
              </p>

              {/* Quote block */}
              <div className="border-l-4 border-red-700 pl-4 bg-red-50 py-3 pr-4 rounded-r-lg mb-8">
                <p className="text-red-900 italic text-sm leading-relaxed">
                  &ldquo;Simply we will tell you → What you can do better than others, how you can outsmart the race &amp; Troubles&rdquo;
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-red-800 hover:bg-red-700 text-white px-7 py-3 rounded-lg font-medium shadow-md transition-colors duration-200"
              >
                Discover Now
              </motion.button>

              {/* Step counter */}
              <div className="mt-10 hidden md:flex items-center gap-3">
                <div className="h-px flex-1 bg-red-200" />
                <span className="text-red-800/40 text-xs tracking-widest uppercase">4 steps</span>
                <div className="h-px flex-1 bg-red-200" />
              </div>
            </motion.div>
          </div>

          {/* Right scrolling cards */}
          <div className="w-full md:w-3/5 flex flex-col gap-6">
            {CARDS.map((card, i) => (
              <StickyCard
                key={card.number}
                card={card}
                scrollYProgress={scrollYProgress}
                index={i}
                total={CARDS.length}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
