"use client";
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Navbar from "@/components/navbar";
import Paper from "../../../public/assets/border.png";
import Pic2 from "../../../public/assets/pic2.png";
import Pic3 from "../../../public/assets/newborder.png";

export default function DeepasVisionWebsite() {
    const words = ["loop?", "doubt?", "guilt?"];
    const [currentWord, setCurrentWord] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);

    // Testimonial video states
    const [playingVideo, setPlayingVideo] = useState(null);
    const [mutedVideos, setMutedVideos] = useState([]);
    const videoRefs = useRef([]);

    const togglePlay = (index) => {
        const video = videoRefs.current[index];
        if (!video) return;

        if (video.paused) {
            video.play();
            setPlayingVideo(index);
        } else {
            video.pause();
            setPlayingVideo(null);
        }
    };

    const toggleMute = (index) => {
        const video = videoRefs.current[index];
        if (!video) return;

        video.muted = !video.muted;

        setMutedVideos((prev) =>
            video.muted ? [...prev, index] : prev.filter((i) => i !== index)
        );
    };

    const reviews = [
        {
            id: 1,
            name: "Manoj Bajpayee",
            role: "Actor",
            videoUrl: "/videos/review/manoj&shani.mp4",
            review: "Manoj focused on his other sources of income during the period, because he was guided that the Sade Sati would not support him. So instead of crying in the field, he chose to grow in others.",
        },
        {
            id: 2,
            name: "Sourav Joshi",
            role: "Youtuber, Vlogger & Artist",
            videoUrl: "/videos/review/sourav&Kundli.mp4",
            review: "Sourav mentioned many times that he took major decisions considering astrology and settled things accordingly.",
        },
        {
            id: 3,
            name: "Ranveer Allahbadia",
            role: "Youtuber & Podcaster",
            videoUrl: "/videos/review/ranveer&profession.mp4",
            review: "Ranveer Allahbadia follows astrology a lot in his profession — his office, home, and meditation practices are all influenced by it.",
        },
        
        {
            id: 4,
            name: "Sanjiv Goenka",
            role: "Billionaire & Investor",
            videoUrl: "/videos/review/Raj&goenka.mp4",
            review: "For investing in land and selected projects, he often consults his astrologer.",
        }
    ];

    useEffect(() => {
        const current = words[wordIndex];
        const typingSpeed = deleting ? 40 : 90;

        const timeout = setTimeout(() => {
            if (!deleting) {
                if (charIndex < current.length) {
                    setCurrentWord((prev) => prev + current[charIndex]);
                    setCharIndex((prev) => prev + 1);
                } else {
                    setTimeout(() => setDeleting(true), 1400);
                }
            } else {
                if (charIndex > 0) {
                    setCurrentWord((prev) => prev.slice(0, -1));
                    setCharIndex((prev) => prev - 1);
                } else {
                    setDeleting(false);
                    setWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [charIndex, deleting, wordIndex]);

    return (
        <div id="home" className="relative min-h-screen bg-white">
            {/* Top Border */}
            <div className="relative w-full">
                <Image
                    src={Paper}
                    alt="Torn Border"
                    className="w-full h-auto"
                    priority
                />
            </div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4">
                <Navbar />
                <main className="flex flex-col md:flex-row mt-10 md:mt-20 items-center">
                    <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                        <h2 className="text-5xl md:text-7xl text-red-800 mb-4 md:mb-8">
                            Stuck in a{" "}
                            <span className="min-w-[11ch] text-left animate-pulse">
                                {currentWord}
                            </span>
                        </h2>

                        <p className="text-xl md:text-2xl text-red-800 font-medium">
                            दौड़ का ये फेरा, कौन सा रास्ता है मेरा?
                        </p>
                    </div>

                    <div className="w-full md:w-1/2">
                        <video
                            src="/videos/hero-medi-21 (1).mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-auto object-cover max-w-lg mx-auto"
                        />
                    </div>
                </main>
            </div>

            {/* the original videos  */}
<div className="mt-20 px-4 max-w-7xl mx-auto">
  <h3 className="text-4xl font-bold text-center text-red-800 mb-10">What people say-</h3>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {reviews.map((review, index) => (
      <div key={review.id} className="rounded-xl shadow-lg p-4  bg-white">
        <div className="w-full h-[250px]">
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={review.videoUrl}
            className="w-full h-full rounded-lg object-cover cursor-pointer"
            onClick={() => togglePlay(index)}
            muted={mutedVideos.includes(index)}
            controls
          />
        </div>
        <div className="mt-3">
          <p className="text-lg font-semibold">{review.name}</p>
          <p className="text-sm text-gray-600">{review.role}, {review.company}</p>
          <p className="mt-2 text-sm italic text-gray-800">"{review.review}"</p>
          <button
            onClick={() => toggleMute(index)}
            className="mt-2 text-xs text-red-600 underline"
          >
            {mutedVideos.includes(index) ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

        </div>
    );
}
