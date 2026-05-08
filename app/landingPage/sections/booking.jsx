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

      <section id="contact" className="relative w-full h-screen overflow-hidden text-white">

        {/* Animated glowing orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <div style={orbStyle({ top: "8%",  left: "12%",  width: 320, height: 320, background: "radial-gradient(circle, rgba(156,32,32,0.11) 0%, transparent 70%)", animation: "orbFloat1 8s ease-in-out infinite" })} />
          <div style={orbStyle({ bottom: "12%", right: "8%",  width: 260, height: 260, background: "radial-gradient(circle, rgba(156,32,32,0.09) 0%, transparent 70%)", animation: "orbFloat2 10s ease-in-out infinite" })} />
          <div style={orbStyle({ top: "42%", right: "28%", width: 180, height: 180, background: "radial-gradient(circle, rgba(156,32,32,0.07) 0%, transparent 70%)", animation: "orbFloat3 6s ease-in-out infinite" })} />
          <div style={orbStyle({ bottom: "8%", left: "33%",  width: 140, height: 140, background: "radial-gradient(circle, rgba(156,32,32,0.08) 0%, transparent 70%)", animation: "orbFloat1 7s ease-in-out 2s infinite" })} />
        </div>

        {/* Top Half */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white flex items-center justify-start px-8 md:px-20" style={{ zIndex: 1 }}>
          <h2 className="lets-anim text-4xl absolute bottom-0 md:text-[6.6vw] font-bold text-red-800">
            Let&apos;s
          </h2>
        </div>

        {/* Bottom Half */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-300/40 to-white flex items-end justify-end px-8 md:px-20 pb-10" style={{ zIndex: 1 }}>
          <p className="talk-anim text-4xl absolute top-0 md:text-[6.6vw] font-bold text-red-800">
            Talk.
          </p>
        </div>

        {/* TidyCal Widget */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[70%] z-10">
          <div
            className="tidycal-embed"
            data-path="vedantwork6"
            style={{ minWidth: "320px", height: "700px" }}
          />
        </div>
      </section>
    </>
  );
};

export default Booking;
