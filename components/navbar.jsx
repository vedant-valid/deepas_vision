"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { name: "Home",     href: "#home"     },
  { name: "About",    href: "#about"    },
  { name: "Services", href: "#samadhan" },
  { name: "Kundli",   href: "/kundli"   },
  { name: "FAQs",     href: "#faqs"     },
  { name: "Contact",  href: "#contact"  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  function handleNav(item) {
    setIsOpen(false);
    if (item.name === "Home") {
      if (pathname !== "/") router.push("/");
      else document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <header className="sticky top-3 z-50 w-full px-4">
      {/* Glass pill */}
      <div
        className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-2.5 rounded-2xl"
        style={{
          background: "rgba(255,250,245,0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(104,2,13,0.12)",
          boxShadow: "0 4px 24px rgba(104,2,13,0.08), 0 1px 0 rgba(255,255,255,0.6) inset",
        }}
      >
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <Image
            src="/assets/logo.png"
            alt="Deepa's Vision"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <span
            className="text-base md:text-lg text-[#68020d] font-bold tracking-wide leading-none"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Deepa&apos;s Vision
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = item.href.startsWith("/")
              ? pathname === item.href
              : false;

            const inner = item.name === "Home" ? (
              <button
                onClick={() => handleNav(item)}
                className="relative px-4 py-1.5 text-sm font-medium rounded-xl transition-colors duration-200 outline-none"
                style={{ color: isActive || hovered === item.name ? "#fff" : "#68020d" }}
              >
                {item.name}
              </button>
            ) : item.href.startsWith("/") ? (
              <Link
                href={item.href}
                className="relative px-4 py-1.5 text-sm font-medium rounded-xl transition-colors duration-200 block"
                style={{ color: isActive || hovered === item.name ? "#fff" : "#68020d" }}
              >
                {item.name}
              </Link>
            ) : (
              <a
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="relative px-4 py-1.5 text-sm font-medium rounded-xl transition-colors duration-200 block"
                style={{ color: hovered === item.name ? "#fff" : "#68020d" }}
              >
                {item.name}
              </a>
            );

            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setHovered(item.name)}
                onMouseLeave={() => setHovered(null)}
              >
                {(hovered === item.name || isActive) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "linear-gradient(135deg, #68020d, #9c2020)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{inner}</span>
              </div>
            );
          })}
        </nav>

        {/* CTA */}
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="hidden md:inline-flex items-center text-sm font-semibold px-4 py-2 rounded-xl text-white flex-shrink-0 transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #68020d, #9c2020)" }}
        >
          Let&apos;s Sit
        </motion.a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#68020d] p-1"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="md:hidden max-w-5xl mx-auto mt-2 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,250,245,0.95)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(104,2,13,0.12)",
            boxShadow: "0 8px 24px rgba(104,2,13,0.10)",
          }}
        >
          <ul className="flex flex-col p-3 gap-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.href.startsWith("/") ? (
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[#68020d] hover:bg-[#68020d] hover:text-white transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => { setIsOpen(false); handleNav(item); }}
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[#68020d] hover:bg-[#68020d] hover:text-white transition-all duration-200"
                  >
                    {item.name}
                  </a>
                )}
              </li>
            ))}
            <li className="mt-1">
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white text-center"
                style={{ background: "linear-gradient(135deg, #68020d, #9c2020)" }}
              >
                Let&apos;s Sit
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
