"use client"
import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionDivider from "@/components/SectionDivider";
import { UserCheck, BookOpenCheck, BrainCircuit, Map } from 'lucide-react';

// Extracted to its own component so useTransform is at top level (Rules of Hooks)
function StickyCard({ card, scrollYProgress, index, total }) {
    const start = index / total;
    const end = (index + 1) / total;
    const cardY = useTransform(scrollYProgress, [start, end], [100, 0]);

    return (
        <motion.div
            className="sticky top-0 h-screen flex items-center justify-center"
            style={{ y: cardY }}
        >
            <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 w-4/5 h-[50%] flex flex-col justify-center hover:shadow-2xl hover:border-red-300 transition-all duration-300">
                <div className="text-center">
                    <div className="mb-4 flex justify-center">{card.icon}</div>
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
}

export default function StickyLayout() {
    const [cards] = useState([
        {
            id: 1,
            title: '1:1 Strategic Session',
            content: 'By sitting calmly in a 1-1 discussion which वर्क्स on the formula — Session = Strategy + Direction – (Chaos × Doubts).',
            icon: <UserCheck className="w-6 h-6 text-red-800" />,
        },
        {
            id: 2,
            title: 'Astrology as a Science',
            content: 'Answering your unlimited questions + queries with proper logics & मेथड्स. As astrology is not a ₹5/min thing, it\'s science.',
            icon: <BookOpenCheck className="w-6 h-6 text-red-800" />,
        },
        {
            id: 3,
            title: 'The दीक्षा Process',
            content: 'The दीक्षा involves — Study of your \'9\' Charts + Numerology + Time periods.',
            icon: <BrainCircuit className="w-6 h-6 text-red-800" />,
        },
        {
            id: 4,
            title: 'From Possibility to Plan',
            content: 'After the discussion and a satisfied session, we will लुक among all these choices, opportunities & fields.',
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
            setTimeout(() => { el.classList.add('animated'); }, index * 120);
        });
    }, []);

    return (
        <>
        <div id="about">
            <SectionDivider />
        </div>
        <div className="flex relative flex-col md:flex-row w-full min-h-screen bg-white text-gray-900" ref={containerRef}>

            {/* Left sticky panel */}
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
                                How Deepa&apos;s shiksha works?
                            </h1>
                        </motion.div>

                        <motion.div style={{ y: subtitleY }} className="space-y-6">
                            <div className="text-left space-y-4 animate-in opacity-0">
                                <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                                    With years of experience in{' '}
                                    <span className="font-semibold text-red-700">वैदिक Astrology</span>,{' '}
                                    <span className="font-semibold text-red-700">Numerology</span>, and{' '}
                                    <span className="font-semibold text-red-700">Lal Kitab</span>, Deepa&apos;s Vision offers{' '}
                                    <span className="font-semibold">कर्मिक उपाय</span> and guides you toward the right{' '}
                                    <span className="font-semibold">करियर</span> and{' '}
                                    <span className="font-semibold">जीवन मार्ग</span> — not through{' '}
                                    <span className="font-semibold">भय</span>, but with clarity.
                                </p>

                                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r">
                                    <p className="text-red-900 font-bold italic text-base md:text-lg">
                                        &ldquo;Simply we will tell you → What you can do better than others, हाउ you can outsmart the race & Troubles&rdquo;
                                    </p>
                                </div>
                            </div>

                            <button className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 md:px-8 md:py-3 rounded-lg font-medium shadow-md animate-in opacity-0 transition-all duration-300">
                                Discover Now
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right scrolling cards — desktop */}
            <div className="w-full md:w-3/5">
                <div className="relative hidden md:block h-[500vh]">
                    {cards.map((card, index) => (
                        <StickyCard
                            key={card.id}
                            card={card}
                            scrollYProgress={scrollYProgress}
                            index={index}
                            total={cards.length}
                        />
                    ))}
                </div>

                {/* Mobile cards */}
                <div className="block md:hidden px-4 space-y-8 py-6">
                    {cards.map(card => (
                        <div
                            key={card.id}
                            className="bg-gradient-to-br from-red-50 via-white to-red-100 p-6 rounded-xl shadow-md border border-gray-200 transition hover:shadow-lg"
                        >
                            <div className="text-center">
                                <div className="mb-2 flex justify-center">{card.icon}</div>
                                <h3 className="text-xl font-semibold mb-2 text-red-800">{card.title}</h3>
                                <p className="text-gray-700 mb-4">{card.content}</p>
                                <button className="bg-red-800 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm transition-colors">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}
