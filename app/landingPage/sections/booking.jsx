"use client";
import { useEffect } from "react";

const orbStyle = (extra) => ({
  position: "absolute",
  borderRadius: "50%",
  pointerEvents: "none",
  ...extra,
});

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
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-40px) scale(1.1); }
          66%      { transform: translate(-20px,20px) scale(0.95); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-40px,30px) scale(1.05); }
          66%      { transform: translate(25px,-25px) scale(1.1); }
        }
        @keyframes orbFloat3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(20px,40px) scale(1.08); }
        }
        @keyframes slideInLeft  { from { opacity:0; transform:translateX(-50px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInRight { from { opacity:0; transform:translateX(50px);  } to { opacity:1; transform:translateX(0); } }
        .lets-anim { animation: slideInLeft  1s ease forwards; }
        .talk-anim { animation: slideInRight 1s ease 0.35s forwards; opacity: 0; }
      `}</style>

      <section id="contact" className="relative w-full bg-white overflow-hidden">

        {/* Animated glowing orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <div style={orbStyle({ top: "5%",  left: "5%",   width: 300, height: 300, background: "radial-gradient(circle, rgba(156,32,32,0.10) 0%, transparent 70%)", animation: "orbFloat1 8s ease-in-out infinite" })} />
          <div style={orbStyle({ bottom: "5%", right: "5%", width: 260, height: 260, background: "radial-gradient(circle, rgba(156,32,32,0.09) 0%, transparent 70%)", animation: "orbFloat2 10s ease-in-out infinite" })} />
          <div style={orbStyle({ top: "40%", right: "20%", width: 180, height: 180, background: "radial-gradient(circle, rgba(156,32,32,0.06) 0%, transparent 70%)", animation: "orbFloat3 6s ease-in-out infinite" })} />
          <div style={orbStyle({ bottom: "20%", left: "25%", width: 140, height: 140, background: "radial-gradient(circle, rgba(156,32,32,0.07) 0%, transparent 70%)", animation: "orbFloat1 7s ease-in-out 2s infinite" })} />
        </div>

        {/* Heading */}
        <div className="relative flex items-baseline justify-between px-10 md:px-20 pt-16 pb-6" style={{ zIndex: 1 }}>
          <h2 className="lets-anim text-5xl md:text-[7vw] font-bold text-red-800 leading-none">
            Let&apos;s
          </h2>
          <p className="talk-anim text-5xl md:text-[7vw] font-bold text-red-800 leading-none">
            Talk.
          </p>
        </div>

        {/* Divider line */}
        <div className="relative mx-10 md:mx-20 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent" style={{ zIndex: 1 }} />

        {/* TidyCal Widget */}
        <div className="relative w-full px-4 md:px-10 py-8" style={{ zIndex: 2 }}>
          <div
            className="tidycal-embed mx-auto"
            data-path="vedantwork6"
            style={{ minWidth: "320px", maxWidth: "900px" }}
          />
        </div>
      </section>
    </>
  );
};

export default Booking;
