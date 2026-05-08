"use client"
import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { name: "Home",         href: "#home"     },
  { name: "How It Works", href: "#about"    },
  { name: "Services",     href: "#samadhan" },
  { name: "Testimonials", href: "#bharosa"  },
  { name: "Book a Session", href: "#contact"},
];

const SERVICE_LINKS = [
  "Students & Career",
  "Business Owners",
  "Relationships & Family",
  "Mental Health",
  "Investments",
];

const Footer = () => {
  return (
    <footer className="relative bg-[#0C0705] pt-12 pb-6 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />

      {/* Subtle OM watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[12rem] leading-none" style={{ color: "rgba(180,120,20,0.03)", fontFamily: "serif" }}>
          ॐ
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Brand row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-8 border-b border-amber-900/20">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt="Deepa's Vision"
              width={48}
              height={48}
              className="rounded-full object-cover opacity-90"
            />
            <div>
              <h2
                className="text-2xl font-bold text-amber-400 tracking-wide mb-0.5"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Deepa&apos;s Vision
              </h2>
              <p className="text-amber-700/50 text-xs tracking-[3px] uppercase">
                ज्योतिष &nbsp;•&nbsp; नक्षत्र &nbsp;•&nbsp; कर्म
              </p>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -2, scale: 1.1 }}
                className="w-8 h-8 rounded-full border border-amber-800/40 flex items-center justify-center text-amber-500/60 hover:text-amber-300 hover:border-amber-500/60 transition-all duration-200"
              >
                <Icon className="w-3.5 h-3.5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">

          {/* Quick Links */}
          <div>
            <h4 className="text-amber-400 text-[10px] font-semibold tracking-[3px] uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    className="text-amber-100/45 hover:text-amber-300 text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-800 group-hover:bg-amber-500 transition-colors flex-shrink-0" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Consult For */}
          <div>
            <h4 className="text-amber-400 text-[10px] font-semibold tracking-[3px] uppercase mb-4">
              Consult For
            </h4>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((item, i) => (
                <li key={i}>
                  <a
                    href="#samadhan"
                    className="text-amber-100/45 hover:text-amber-300 text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-800 group-hover:bg-amber-500 transition-colors flex-shrink-0" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-amber-400 text-[10px] font-semibold tracking-[3px] uppercase mb-4">
              Reach Out
            </h4>
            <ul className="space-y-4 mb-5">
              <li className="flex items-center gap-3">
                <Mail className="w-3.5 h-3.5 text-amber-600/60 flex-shrink-0" />
                <a href="mailto:vedant.work6@gmail.com" className="text-amber-100/50 hover:text-amber-300 text-sm transition-colors break-all">
                  vedant.work6@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-3.5 h-3.5 text-amber-600/60 flex-shrink-0" />
                <a href="tel:+919039953535" className="text-amber-100/50 hover:text-amber-300 text-sm transition-colors">
                  +91 90399 53535
                </a>
              </li>
            </ul>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-amber-800/60 hover:bg-amber-700/70 text-amber-200 text-xs font-medium px-4 py-2 rounded-full transition-all duration-200"
            >
              ✦ Book a Session
            </motion.a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-amber-900/20">
          <p className="text-amber-200/20 text-xs">
            © {new Date().getFullYear()} Deepa&apos;s Vision — सर्वाधिकार सुरक्षित
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms", "FAQ"].map((item, i) => (
              <a key={i} href="#" className="text-amber-200/20 hover:text-amber-500/50 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
