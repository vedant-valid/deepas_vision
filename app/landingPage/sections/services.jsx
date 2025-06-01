"use client";
import React, { useState } from 'react';
import Paper from "../../../public/assets/border.png";
import Image from "next/image";

const ServiceCard = ({ title, items, number, category }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div id='samadhan' className="w-80 h-[420px] perspective-1000 p-4">
            <div
                className={`relative transform-style-preserve-3d transition-all duration-500 ease-in-out ${isHovered ? "card-hover" : ""}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="absolute top-16 right-6 z-10 h-10 w-10 bg-white border border-gray-300 shadow-md flex flex-col items-center justify-center transform translate-z-40">
                    {category && <span className="text-xs font-bold text-maroon">{category}</span>}
                    <span className="text-2xl font-black text-maroon">{number}</span>
                </div>

                <div className={`card-bg border-3 border-white shadow-lg transform-style-preserve-3d transition-all duration-500 ${isHovered ? "card-bg-animate" : ""}`}>
                    <div className="bg-maroon text-white p-6 pt-16 transform-style-preserve-3d h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-4 transform translate-z-50 transition-transform duration-500 hover:translate-z-60">{title}</h3>
                            <ul className="space-y-1 mb-6">
                                {items.map((item, index) => (
                                    <li key={index} className="text-sm transform translate-z-30 transition-transform duration-500 hover:translate-z-60">• {item}</li>
                                ))}
                            </ul>
                        </div>
                        <button className="bg-white text-maroon text-xs font-bold py-2 px-4 uppercase transform translate-z-20 transition-transform duration-500 hover:translate-z-20 hover:bg-gray-400 hover:text-white rounded-lg shadow-md">
                            Let's Sit
                        </button>
                    </div>
                </div>
            </div>
            {category && (
                <div className="text-center mt-2 text-maroon font-medium">
                    {category}
                </div>
            )}
        </div>
    );
};

const ServiceCardsCollection = () => {
    const serviceData = [
        {
            title: "Students & Career",
            number: "1",
            items: [
                "Choosing the right education field",
                "Career hurdles or planning a career switch",
                "Hobbies & passions",
                "Choosing the best for you"
            ]
        },
        {
            title: "Business Owners",
            number: "2",
            items: [
                "Expansion and Franchise",
                "Partnerships and collaborations",
                "Downfalls & solutions",
                "What business to start?",
                "Is it worth the risk?"
            ]
        },
        {
            title: "Corporate Professionals",
            number: "3",
            items: [
                "Job or Role switch",
                "New opportunities",
                "Downfalls & solutions",
                "Foreign settlements",
                "How long should I stay in the job?"
            ]
        },
        {
            title: "Relationships & Family",
            number: "4",
            items: [
                "Resolving marriage and relationship issues.",
                "Family disputes and resolutions.",
                "Stress.",
                "Childcare planning."
            ]
        },
        {
            title: "Mental Health",
            number: "5",
            items: [
                "Depression and frustration",
                "Insomnia",
                "Lack of confidence and individuality",
                "Poor decision-making"
            ]
        },
        {
            title: "Health Problems",
            number: "6",
            items: [
                "Heart problems (stent)",
                "Diabetes",
                "Stress",
                "Eating habits"
            ]
        },
        {
            title: "Investing",
            number: "7",
            items: [
                "Stock market, Land & property investments.",
                "Knowing where to invest—stocks, land, gold, or other assets.",
            ]
        },
        {
            title: "Civil Servants",
            number: "8",
            items: [
                "Postings and transfer orders.",
                "Workplace-related matters.",
            ]
        }
    ];

    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0">
                <div className="absolute inset-0 bg-white/91" />
            </div>

            <div className="relative z-10 p-8">
                <div className="max-w-6xl mx-auto mt-8">
                    <h1 className="text-4xl md:text-5xl font-black text-center mb-2 text-#68020D">
                        What We Cherish For You -
                    </h1>
                    <p className="text-maroon text-center mb-10">(Services)</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[6rem] gap-y-[5rem] justify-items-center">
                    {serviceData.map((service, index) => (
                            <ServiceCard
                                key={index}
                                title={service.title}
                                items={service.items}
                                number={service.number}
                            />
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <button className="relative inline-block px-6 py-2 font-medium text-white group">
                            <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-gradient-to-br from-red-700 to-maroon rounded-lg group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                            <span className="absolute inset-0 w-full h-full bg-maroon rounded-lg border-2 border-white group-hover:opacity-0 transition duration-300 ease-in-out"></span>
                            <span className="relative">Contact Now!</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = `
  @keyframes bgShift {
    to { background-position: -100px 100px, -100px 100px; }
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }

  .card-hover {
    transform: rotate3d(0.5, 1, 0, 30deg);
  }

  .card-bg {
    padding-top: 50px;
    background: linear-gradient(135deg, #0000 18.75%,rgb(255, 255, 255) 0 31.25%, #0000 0),
      repeating-linear-gradient(45deg,rgb(255, 255, 255) -6.25% 6.25%, #ffffff 0 18.75%);
    background-size: 60px 60px;
    background-position: 0 0, 0 0;
    background-color:rgb(255, 255, 255);
    box-shadow: rgba(142, 142, 142, 0.3) 0px 30px 30px -10px;
  }

  .card-bg-animate {
    background-position: -100px 100px, -100px 100px;
  }

  .translate-z-20 {
    transform: translateZ(20px);
  }

  .translate-z-30 {
    transform: translateZ(30px);
  }

  .translate-z-50 {
    transform: translateZ(50px);
  }

  .translate-z-60 {
    transform: translateZ(60px);
  }

  .translate-z-80 {
    transform: translateZ(80px);
  }

  .bg-maroon {
    background-color: rgb(104, 2, 13);
  }

  .text-maroon {
    color: rgb(104, 2, 13);
  }

  .border-3 {
    border-width: 0px;
  }
`;

const ServiceCards = () => {
    return (
        <div className='relative '>
            <div className="absolute z-99 -top-1 left-0 w-full h-16">
                <Image
                    src={Paper}
                    alt="Torn Paper Top"
                    objectFit="cover"
                    className="w-full h-full"
                />
            </div>
            <style>{styles}</style>
            <ServiceCardsCollection />
        </div>
    );
};

export default ServiceCards;
