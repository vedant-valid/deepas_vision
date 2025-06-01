
"use client"
import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Paper from "../../../public/assets/border.png";
import Image from "next/image";

import {
    UserCheck,
    BookOpenCheck,
    BrainCircuit,
    Compass,
    Map,
} from 'lucide-react';

export default function StickyLayout() {
    const [cards] = useState([
        {
            id: 1,
            title: '1:1 Strategic Session',
            content: 'By sitting calmly in a 1-1 Discussion which वर्क्स on the formula -Session=Strategy+Direction–(Chaos x Doubts). ',
            icon: <UserCheck className="w-6 h-6 text-red-800" />,
        },
        {
            id: 2,
            title: 'Astrology as a Science',
            content: 'Answering your unlimited questions+queries with proper logics & मेथड्स. As astrology is not a ₹5/min thing, its science.',
            icon: <BookOpenCheck className="w-6 h-6 text-red-800" />,
        },
        {
            id: 3,
            title: 'The दीक्षा Process',
            content: 'The दीक्षा involves- Study of your ‘9’ Charts + Numerology + Timeperiods.',
            icon: <BrainCircuit className="w-6 h-6 text-red-800" />,
        },
        // {
        //     id: 4,
        //     title: 'Clarity Over Confusion',
        //     content: 'Replace doubts with direction. Leave the session with actionable insights, emotional calm, and a map of your potential paths.',
        //     icon: <Compass className="w-6 h-6 text-red-800" />,
        // },
        {
            id: 5,
            title: 'From Possibility to Plan',
            content: 'After the discussion and a satisfied session,we will लुक among all these choices , opportunities & fields.',
            icon: <Map className="w-6 h-6 text-red-800" />,
        },
    ]);

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -40]);
    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -150]);

    useEffect(() => {
        const animateElements = document.querySelectorAll('.animate-in');
        animateElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animated');
            }, index * 120);
        });
    }, []);

    return (
        <div id='about' className="flex relative flex-col md:flex-row w-full min-h-screen bg-white text-gray-900" ref={containerRef}>
            <div className="absolute -top-1 left-0 w-full h-16">
                <Image
                    src={Paper}
                    alt="Torn Paper Top"
                    objectFit="cover"
                    className="w-full h-full"
                />
            </div>
            <div className="w-full md:w-2/5 md:sticky md:top-0 h-auto md:h-screen flex items-center justify-center py-8 md:py-0">
                <div className="relative w-full h-full flex items-center justify-center px-4 md:px-8">
                    <motion.div
                        className="absolute w-80 h-80 rounded-full bg-red-200 opacity-20 blur-2xl hidden md:block"
                        style={{ y: backgroundY, x: -60 }}
                    />
                    <motion.div
                        className="absolute w-52 h-52 rounded-full bg-red-300 opacity-20 blur-2xl hidden md:block"
                        style={{ y: backgroundY, x: 100 }}
                    />

                    <div className="relative z-10 text-center max-w-md">
                        <motion.div style={{ y: titleY }}>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-600 animate-in opacity-0">
                            How Deepa’s shiksha works ? 
                            </h1>
                        </motion.div>

                        <motion.div style={{ y: subtitleY }} className="space-y-6">
  <div className="text-left space-y-4 animate-in opacity-0">
    <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
      With years of experience in <span className="font-semibold text-red-700">वैदिक Astrology</span>, <span className="font-semibold text-red-700">Numerology</span>, and <span className="font-semibold text-red-700">Lal Kitab</span>, Deepa’s Vision offer <span className="font-semibold">कर्मिक उपाय</span> and guide you toward the right <span className="font-semibold">करियर</span> and <span className="font-semibold">जीवन मार्ग</span> — not through <span className="font-semibold">भय</span>, but with clarity and meaningful solutions to enrich your <span className="font-semibold">जीवन</span>.
    </p>

    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r">
      <p className="text-red-900 font-bold italic text-base md:text-lg">
        "Simply we will tell you → What you can do better than others, हाउ you can outsmart the race & Troubles"
      </p>
    </div>
  </div>

                            <button className="bg-gradient-to-r from-red-800 to-red-800 hover:from-red-700 hover:to-red-700 text-white px-6 py-3 md:px-8 md:py-3 rounded-lg font-medium shadow-md animate-in opacity-0 transition-all duration-300">
                                Discover Now
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-3/5">
                <div className="relative hidden md:block h-[500vh]">
                    {cards.map((card, index) => {
                        const start = index / cards.length;
                        const end = (index + 1) / cards.length;
                        const cardY = useTransform(scrollYProgress, [start, end], [100, 0]);

                        return (
                            <motion.div
                                key={card.id}
                                className="sticky top-0 h-screen flex items-center justify-center"
                                style={{ y: cardY }}
                            >
                                <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 w-4/5 h-[50%] flex flex-col justify-center hover:shadow-2xl hover:border-red-300 transition-all duration-300">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">{card.icon}</div>
                                        <h3 className="text-2xl font-bold mb-3 text-red-800">{card.title}</h3>
                                        <p className="text-gray-700 mb-6 max-w-lg mx-auto">{card.content}</p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-red-800 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-300"
                                        >
                                            Learn More
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="block md:hidden px-4 space-y-8 py-6">
                    {cards.map(card => (
                      <div
                      key={card.id}
                      className="bg-gradient-to-br from-red-50 via-white to-red-100 p-6 rounded-xl shadow-md border border-gray-200 transition hover:shadow-lg"
                    >
                            <div className="text-center">
                                <div className="text-3xl mb-2">{card.icon}</div>
                                <h3 className="text-xl font-semibold mb-2 text-red-800">{card.title}</h3>
                                <p className="text-gray-700 mb-4">{card.content}</p>
                                <button className="bg-red-800 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .animate-in {
          transform: translateY(20px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .animate-in.animated {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
        </div>
    );
}