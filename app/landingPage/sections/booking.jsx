"use client";
import { useEffect } from "react";

const Booking = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://asset-tidycal.b-cdn.net/js/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes expandLine {
          from { width: 0; }
          to   { width: 80px; }
        }
        @keyframes orbDrift1 {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(40px,-50px); }
        }
        @keyframes orbDrift2 {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(-35px,45px); }
        }
        .booking-heading { animation: fadeUp 0.9s ease forwards; }
        .booking-sub     { animation: fadeUp 0.9s ease 0.2s forwards; opacity: 0; }
        .booking-line    { animation: expandLine 1s ease 0.4s forwards; width: 0; }
      `}</style>

      <section id="contact" className="relative w-full bg-[#fffaf5] overflow-hidden py-20">

        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position: "absolute", top: "10%", left: "5%",
            width: 350, height: 350, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(156,32,32,0.08) 0%, transparent 70%)",
            animation: "orbDrift1 10s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: "5%", right: "5%",
            width: 280, height: 280, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(156,32,32,0.07) 0%, transparent 70%)",
            animation: "orbDrift2 12s ease-in-out infinite",
          }} />
        </div>

        {/* Heading */}
        <div className="relative text-center mb-10 z-10">
          <p className="booking-sub text-sm uppercase tracking-[4px] text-red-800/50 mb-3">
            Book a Session
          </p>
          <h2 className="booking-heading text-5xl md:text-6xl font-bold text-red-800">
            Let&apos;s Talk.
          </h2>
          <div className="flex justify-center mt-4">
            <div className="booking-line h-[3px] rounded-full bg-gradient-to-r from-red-800/30 via-red-800 to-red-800/30" />
          </div>
          <p className="booking-sub mt-4 text-gray-500 text-sm max-w-md mx-auto">
            Choose a time that works for you — a calm, focused conversation to find your path.
          </p>
        </div>

        {/* TidyCal Widget */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
          <div
            className="tidycal-embed"
            data-path="vedantwork6"
            style={{ minWidth: "320px" }}
          />
        </div>
      </section>
    </>
  );
};

export default Booking;
