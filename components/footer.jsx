"use client"
import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Mail, Phone, Star } from "lucide-react";

const STARS = [
  { top: "8%",  left: "12%", size: 2,   delay: 0    },
  { top: "15%", left: "35%", size: 1.5, delay: 0.9  },
  { top: "5%",  left: "67%", size: 2.5, delay: 0.3  },
  { top: "22%", left: "82%", size: 1.5, delay: 1.5  },
  { top: "40%", left: "5%",  size: 1.5, delay: 0.6  },
  { top: "35%", left: "55%", size: 2,   delay: 1.2  },
  { top: "60%", left: "25%", size: 1,   delay: 2.1  },
  { top: "70%", left: "75%", size: 2,   delay: 0.4  },
  { top: "85%", left: "10%", size: 1.5, delay: 1.8  },
  { top: "90%", left: "45%", size: 1,   delay: 0.7  },
  { top: "75%", left: "90%", size: 2,   delay: 1.1  },
  { top: "50%", left: "95%", size: 1.5, delay: 2.4  },
  { top: "12%", left: "50%", size: 1,   delay: 0.2  },
  { top: "30%", left: "18%", size: 2,   delay: 1.6  },
  { top: "65%", left: "60%", size: 1.5, delay: 0.8  },
  { top: "45%", left: "40%", size: 1,   delay: 2.0  },
  { top: "18%", left: "92%", size: 1,   delay: 1.3  },
  { top: "55%", left: "8%",  size: 1.5, delay: 2.6  },
  { top: "92%", left: "70%", size: 1,   delay: 0.5  },
  { top: "3%",  left: "22%", size: 1.5, delay: 1.9  },
];

const NAV_LINKS = [
  { name: "Home",                  href: "#home"     },
  { name: "How It Works",          href: "#about"    },
  { name: "Services (समाधान)",     href: "#samadhan" },
  { name: "Products",              href: "/products" },
  { name: "Testimonials (भरोसा)", href: "#bharosa"  },
  { name: "Book a Session",        href: "#contact"  },
];

const SERVICE_LINKS = [
  "Students & Career",
  "Business Owners",
  "Corporate Professionals",
  "Relationships & Family",
  "Mental Health",
  "Health Problems",
  "Investments",
  "Civil Servants",
];

const Footer = () => {
  return (
    <footer className="relative bg-[#0C0705] pt-24 pb-10 overflow-hidden">
      {/* Twinkling stars */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-300"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
            }}
            animate={{ opacity: [0.1, 0.9, 0.1] }}
            transition={{
              duration: 2.5 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Om watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="text-[20rem] leading-none"
          style={{ color: "rgba(180,120,20,0.035)", fontFamily: "serif" }}
        >
          ॐ
        </span>
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Brand header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-6xl italic font-bold text-amber-400 mb-4 tracking-wide"
            style={{
              fontFamily: "var(--font-cinzel)",
              textShadow: "0 0 50px rgba(217,170,50,0.2)",
            }}
          >
            Deepa&apos;s Vision
          </h2>
          <p className="text-amber-700/60 text-xs tracking-[0.4em] uppercase">
            — ज्योतिष &nbsp;•&nbsp; नक्षत्र &nbsp;•&nbsp; कर्म —
          </p>
        </motion.div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-100/50 text-sm leading-relaxed mb-5">
              Astrology is just a finger pointing at reality. We help you understand where to look — not just what to see.
            </p>
            <p className="text-amber-500/60 italic text-sm mb-7">
              &ldquo;तारों की भाषा, जीवन का मार्ग।&rdquo;
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Youtube,   href: "#" },
              ].map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  whileHover={{ y: -3, scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full border border-amber-800/40 flex items-center justify-center text-amber-500/70 hover:text-amber-300 hover:border-amber-500/60 hover:bg-amber-950/50 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-amber-400 text-xs font-semibold tracking-[0.25em] uppercase mb-6 flex items-center gap-2">
              <Star className="w-3 h-3 fill-amber-400" /> Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={item.href}
                    className="text-amber-100/50 hover:text-amber-300 text-sm transition-colors duration-300 flex items-center gap-2.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-800 group-hover:bg-amber-500 transition-colors flex-shrink-0" />
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-amber-400 text-xs font-semibold tracking-[0.25em] uppercase mb-6 flex items-center gap-2">
              <Star className="w-3 h-3 fill-amber-400" /> Consult For
            </h4>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href="#samadhan"
                    className="text-amber-100/50 hover:text-amber-300 text-sm transition-colors duration-300 flex items-center gap-2.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-800 group-hover:bg-amber-500 transition-colors flex-shrink-0" />
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-amber-400 text-xs font-semibold tracking-[0.25em] uppercase mb-6 flex items-center gap-2">
              <Star className="w-3 h-3 fill-amber-400" /> Reach Out
            </h4>
            <ul className="space-y-5 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-amber-800/40 flex items-center justify-center text-amber-500/70 flex-shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-amber-200/30 text-[10px] uppercase tracking-widest mb-1">Email</p>
                  <a
                    href="mailto:vedant.work6@gmail.com"
                    className="text-amber-100/60 hover:text-amber-300 transition-colors text-sm break-all"
                  >
                    vedant.work6@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-amber-800/40 flex items-center justify-center text-amber-500/70 flex-shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-amber-200/30 text-[10px] uppercase tracking-widest mb-1">WhatsApp / Call</p>
                  <a
                    href="tel:+919039953535"
                    className="text-amber-100/60 hover:text-amber-300 transition-colors text-sm"
                  >
                    +91 90399 53535
                  </a>
                </div>
              </li>
            </ul>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-amber-100 text-sm font-medium px-5 py-2.5 rounded-full shadow-lg transition-all duration-300"
            >
              ✦ Book a Session
            </motion.a>
          </motion.div>
        </div>

        {/* Navagraha divider */}
        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-900/30" />
          <div className="flex items-center gap-3 text-amber-700/50 text-xs tracking-[0.4em] uppercase">
            <span className="text-base">✦</span>
            <span>नवग्रह</span>
            <span className="text-base">✦</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-900/30" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-amber-200/25 text-xs">
            © {new Date().getFullYear()} Deepa&apos;s Vision — सर्वाधिकार सुरक्षित।
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            {["Privacy Policy", "Terms of Service", "FAQ"].map((item, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -1 }}
                className="text-amber-200/25 hover:text-amber-500/60 text-xs transition-colors duration-300"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
