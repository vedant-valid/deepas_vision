"use client"
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Hand1 from "../../../public/assets/hand1.png";
import SectionDivider from "@/components/SectionDivider";

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
          <Image
            src={Hand1}
            alt=""
            height={168}
            width={200}
            className="w-auto object-contain"
            style={{ height: "10.5rem" }}
          />
        </div>
      </div>
    </div>
  );
}
