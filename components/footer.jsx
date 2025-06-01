"use client"
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Star, Moon } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="relative bg-gradient-to-b from-white to-blackpt-24 pb-16 overflow-hidden pt-24">
      {/* Paper-cut decorative elements */}
      <div className="absolute bottom-0 rotate-180 left-0 w-full overflow-hidden pointer-events-none z-0">
        <svg className="w-full h-48" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="url(#grad)"
            fillOpacity="1"
            d="M0,224L60,213.3C120,203,240,181,360,170.7C480,160,600,160,720,181.3C840,203,960,245,1080,245.3C1200,245,1320,203,1380,181.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#fee2e2", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#991b1b", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Cosmic decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Red gradient circles */}
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-gradient-to-br from-red-800/5 to-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 top-1/4 w-80 h-80 bg-gradient-to-br from-red-800/10 to-red-800/15 rounded-full blur-3xl"></div>
        
        {/* Stars */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-red-800/30 rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
      
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
         
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl  italic font-bold text-gray-900 mb-6 flex items-center">
             
              Deepa's vision
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
            Astrology is just a finger pointing at reality.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1, color: "#991b1b" }}
                  whileTap={{ scale: 0.9 }}
                  className="text-black hover:text-red-800 transition-colors duration-300 bg-white p-2 rounded-full shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Star className="w-5 h-5 text-red-800 mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[ 'Services', 'Products ', '9 Grahas','Testimonials','FAQS'].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a href="#" className="text-gray-600 hover:text-red-800 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-red-800 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
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
            <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Star className="w-5 h-5 text-red-800 mr-2" />
              Our Services
            </h4>
            <ul className="space-y-3">
              {['Students & Career', 'Corporate Professionals', 'Health Problem', 'Business', '& more'].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a href="#" className="text-gray-600 hover:text-red-800 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-red-800 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
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
            <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Star className="w-5 h-5 text-red-800 mr-2" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start"
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-gradient-to-br from-red-800/10 to-red-800/20 p-2 rounded-lg mr-4 shadow-inner">
                  <Mail className="w-5 h-5 text-red-800" />
                </div>
                <div>
                  <p className="text-black text-sm">Email us at</p>
                  <a href="mailto:hello@cosmicastrology.com" className="text-gray-800 hover:text-red-800 transition-colors duration-300">
                  vedant.work6@gmail.com
                  </a>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start"
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-gradient-to-br from-red-800/10 to-red-800/20 p-2 rounded-lg mr-4 shadow-inner">
                  <Phone className="w-5 h-5 text-red-800" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Call us at</p>
                  <a href="tel:+1234567890" className="text-gray-800 hover:text-red-800 transition-colors duration-300">
                  +919039953535
                  </a>
                </div>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* Divider with paper-cut effect */}
        <motion.div 
          className="relative my-12 h-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-800/20 to-transparent" style={{
            clipPath: 'polygon(0% 50%, 5% 60%, 10% 50%, 15% 40%, 20% 50%, 25% 60%, 30% 50%, 35% 40%, 40% 50%, 45% 60%, 50% 50%, 55% 40%, 60% 50%, 65% 60%, 70% 50%, 75% 40%, 80% 50%, 85% 60%, 90% 50%, 95% 40%, 100% 50%)'
          }}></div>
        </motion.div>

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-black text-sm mb-4 md:mb-0"
          >
            © {new Date().getFullYear()} Deepa's vision. All celestial rights reserved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 md:gap-6"
          >
            {['Privacy Policy', 'Terms of Service', 'Cookies', 'FAQ'].map((item, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ y: -2, color: "#991b1b" }}
                className="text-black   text-sm transition-colors duration-300 relative px-2"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-red-800 transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;