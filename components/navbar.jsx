"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "HOME", href: "#home" },
    { name: "ABOUT", href: "#about" },
    { name: "समाधान", href: "#samadhan" },
    { name: "PRODUCTS", href: "/products", external: true },
    { name: "9 GRAHAS", href: "#grahas" },
    { name: "भरोसा", href: "#bharosa" },
    { name: "FAQS", href: "#faqs" },
    { name: "CONTACT", href: "#contact" },
  ];
  
  return (
    <header className="sticky top-2 z-50 w-full bg-white shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.h1
          className="text-2xl md:text-3xl italic text-amber-900"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Deepa's Vision */}
        </motion.h1>

        {/* Hamburger (mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-red-900">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Nav Menu */}
        <nav
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent z-40 transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          } md:flex`}
        >
          <ul className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-4 md:p-0 text-red-900 font-medium">
            {menuItems.map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group"
              >
                {item.external ? (
                  <Link
                    href={item.href}
                    className="relative z-10"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : item.name === "HOME" ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      if (pathname !== "/") {
                        router.push("/");
                      } else {
                        document
                          .querySelector("#home")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="relative z-10 bg-transparent text-left"
                  >
                    {item.name}
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className="relative z-10"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                )}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-red-900 transition-all duration-300 group-hover:w-full"></span>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="hidden md:block bg-white text-red-900 px-5 py-2 border border-red-900 rounded-md text-sm hover:bg-red-50 transition"
        >
          Let's Sit
        </motion.button>
      </div>
    </header>
  );
};

export default Navbar;
