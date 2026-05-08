"use client"
import { useState, useEffect, useRef } from "react";
import SectionDivider from "@/components/SectionDivider";

function CelestialAnimation() {
  const zodiacSymbols = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
  const orbDots = Array.from({ length: 24 });

  return (
    <div style={{ width: 200, height: 200, position: "relative" }}>
      <style>{`
        @keyframes spin-slow   { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes spin-rev    { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
        @keyframes pulse-glow  { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
        @keyframes twinkle     { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        .spin-slow  { animation: spin-slow  18s linear infinite; transform-origin: 100px 100px; }
        .spin-rev   { animation: spin-rev   12s linear infinite; transform-origin: 100px 100px; }
        .pulse-glow { animation: pulse-glow  3s ease-in-out infinite; transform-origin: 100px 100px; }
      `}</style>

      <svg viewBox="0 0 200 200" width="200" height="200">
        {/* Outer dashed orbit ring */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="#9c2020" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.3" />

        {/* Outer rotating ring with zodiac symbols */}
        <g className="spin-slow">
          {zodiacSymbols.map((sym, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x = 100 + 80 * Math.cos(angle);
            const y = 100 + 80 * Math.sin(angle);
            return (
              <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                fontSize="11" fill="#9c2020" opacity="0.7"
                style={{ animation: `spin-rev 18s linear infinite`, transformOrigin: `${x}px ${y}px` }}>
                {sym}
              </text>
            );
          })}
        </g>

        {/* Middle ring */}
        <circle cx="100" cy="100" r="62" fill="none" stroke="#c9802e" strokeWidth="1" opacity="0.25" />

        {/* Middle rotating ring with dots */}
        <g className="spin-rev">
          {orbDots.map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const x = 100 + 62 * Math.cos(angle);
            const y = 100 + 62 * Math.sin(angle);
            return (
              <circle key={i} cx={x} cy={y} r={i % 6 === 0 ? 2.5 : 1.2}
                fill={i % 6 === 0 ? "#9c2020" : "#c9802e"}
                opacity={i % 6 === 0 ? 0.8 : 0.4} />
            );
          })}
        </g>

        {/* Inner ring */}
        <circle cx="100" cy="100" r="38" fill="none" stroke="#9c2020" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.3" />

        {/* Petals */}
        <g className="spin-slow">
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x1 = 100 + 20 * Math.cos(angle);
            const y1 = 100 + 20 * Math.sin(angle);
            const x2 = 100 + 36 * Math.cos(angle);
            const y2 = 100 + 36 * Math.sin(angle);
            return (
              <ellipse key={i}
                cx={(x1 + x2) / 2} cy={(y1 + y2) / 2}
                rx="7" ry="3"
                fill="#9c2020" opacity="0.18"
                transform={`rotate(${(i / 8) * 360}, ${(x1+x2)/2}, ${(y1+y2)/2})`}
              />
            );
          })}
        </g>

        {/* Central sun */}
        <g className="pulse-glow">
          <circle cx="100" cy="100" r="18" fill="none" stroke="#9c2020" strokeWidth="1.2" opacity="0.5" />
          <circle cx="100" cy="100" r="12" fill="#9c2020" opacity="0.12" />
          {/* Sun rays */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
            return (
              <line key={i}
                x1={100 + 14 * Math.cos(angle)} y1={100 + 14 * Math.sin(angle)}
                x2={100 + 20 * Math.cos(angle)} y2={100 + 20 * Math.sin(angle)}
                stroke="#9c2020" strokeWidth="1.5" opacity="0.6"
              />
            );
          })}
          {/* ☉ sun symbol */}
          <text x="100" y="100" textAnchor="middle" dominantBaseline="central"
            fontSize="14" fill="#9c2020" opacity="0.85">☉</text>
        </g>

        {/* Twinkling stars scattered around */}
        {[
          [20, 30], [170, 25], [185, 130], [165, 175], [30, 168], [15, 90],
          [140, 10], [55, 15], [190, 65]
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5" fill="#9c2020"
            style={{ animation: `twinkle ${1.5 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function GuidedStatsUI() {
  const [animate, setAnimate] = useState(false);
  const [counters, setCounters] = useState({
    individuals: 0,
    students: 0,
    business: 0,
    countries: 0,
    webinars: 0,
  });
  const sectionRef = useRef(null);

  const targets = {
    individuals: 3500,
    students: 2500,
    business: 300,
    countries: 90,
    webinars: 250000,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setAnimate(true);
        } else {
          setAnimate(false);
          setCounters({ individuals: 0, students: 0, business: 0, countries: 0, webinars: 0 });
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setCounters(prev => {
        const next = { ...prev };
        let allDone = true;

        Object.keys(targets).forEach(key => {
          if (next[key] < targets[key]) {
            next[key] = Math.min(next[key] + Math.ceil(targets[key] / 100), targets[key]);
            allDone = false;
          }
        });

        if (allDone) clearInterval(interval);
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [animate]);

  return (
    <div ref={sectionRef} className="w-full relative p-8 rounded-lg shadow-lg">
      <SectionDivider />

      <div className={`transition-all duration-1000 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <h1 className="text-5xl font-bold mb-12 text-center mt-10 text-red-800">
          So Far We&apos;ve Guided...
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          <div className={`transition-all duration-1000 delay-100 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-4xl font-bold text-red-800">{counters.individuals.toLocaleString()}+</div>
            <div className="mt-2 text-lg">
              individuals
              <div className="text-sm text-gray-600">(in Relationships, Marriages & Birth issues)</div>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-200 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-4xl font-bold text-red-800">{counters.students.toLocaleString()}+</div>
            <div className="mt-2 text-lg">Students in career</div>
          </div>

          <div className={`transition-all duration-1000 delay-300 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-4xl font-bold text-red-800">{counters.business.toLocaleString()}+</div>
            <div className="mt-2 text-lg">Business & factory owners</div>
          </div>

          <div className={`transition-all duration-1000 delay-400 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-4xl font-bold text-red-800">{counters.countries.toLocaleString()}+</div>
            <div className="mt-2 text-lg">Clients over 10 countries</div>
          </div>

          <div className={`transition-all duration-1000 delay-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-4xl font-bold text-red-800">{counters.webinars.toLocaleString()}+</div>
            <div className="mt-2 text-lg">
              individuals in
              <div className="text-sm text-gray-600">(Webinars, YT & 1-1 sessions)</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <CelestialAnimation />
        </div>
      </div>
    </div>
  );
}
