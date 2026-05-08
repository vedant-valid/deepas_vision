"use client";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/navbar";
import TopBanner from "@/components/TopBanner";

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
      videoUrl: "/videos/review/manoj&shani-1.mp4",
      thumbnailUrl: "/thumbnails/Manoj.png",
      review:
        "Manoj focused on his other sources of income during the period, because he was guided that the Sade Sati would not support him. So instead of crying in the field, he chose to grow in others.",
    },
    {
      id: 2,
      name: "Sourav Joshi",
      role: "Youtuber, Vlogger & Artist",
      videoUrl: "/videos/review/sourav&kundli-1.mp4",
      thumbnailUrl: "/thumbnails/Sourav.png",
      review:
        "Sourav mentioned many times that he took major decisions considering astrology and settled things accordingly.",
    },
    {
      id: 3,
      name: "Ranveer Allahbadia",
      role: "Youtuber & Podcaster",
      videoUrl: "/videos/review/ranveer&profession-1.mp4",
      thumbnailUrl: "/thumbnails/Ranveer.png",
      review:
        "Ranveer Allahbadia follows astrology a lot in his profession — his office, home, and meditation practices are all influenced by it.",
    },
    {
      id: 4,
      name: "Sanjiv Goenka",
      role: "Billionaire & Investor",
      videoUrl: "/videos/review/goenka&raj-1.mp4",
      thumbnailUrl: "/thumbnails/Sanjeev.png",
      review:
        "For investing in land and selected projects, he often consults his astrologer.",
    },
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
      <TopBanner />
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4">
        <Navbar />
        <main className="flex flex-col md:flex-row mt-10 md:mt-20 items-center">
          <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">

            {/* Whisper hook */}
            <p className="text-sm text-red-800/50 italic mb-6 tracking-wide">
              &ldquo;It&apos;s not too late — we can still reset.&rdquo;
            </p>

            {/* Main headline */}
            <h2
              className="text-5xl md:text-7xl text-red-800 mb-6 leading-[1.1] font-bold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Stuck in a{" "}
              <span className="relative inline-block">
                <span className="text-red-600">{currentWord}</span>
                <span className="animate-pulse text-red-400">|</span>
              </span>
            </h2>

            {/* Pain-point hooks */}
            <div className="flex flex-col gap-2 mb-7">
              {[
                "Career going nowhere — and you don't know why?",
                "Relationships breaking down, no matter what you try?",
                "Feels like others are winning a race you can't even see?",
              ].map((line, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-700/60 flex-shrink-0" />
                  <p className="text-sm md:text-base text-gray-700 leading-snug">{line}</p>
                </div>
              ))}
            </div>

            {/* Hindi tagline */}
            <p
              className="text-base md:text-lg text-red-800/70 font-medium mb-8 border-l-2 border-red-300 pl-3"
              style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
            >
              दौड़ का ये फेरा, कौन सा रास्ता है मेरा?
            </p>

            {/* CTA */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #68020d, #9c2020)" }}
            >
              Let&apos;s find your path →
            </a>
          </div>

          <div className="w-full md:w-1/2 relative flex items-center justify-center">
            {/* Glow ring behind video */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div style={{
                width: '70%', height: '70%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(156,32,32,0.10) 0%, transparent 70%)',
                animation: 'heroGlow 4s ease-in-out infinite',
              }} />
            </div>
            <style>{`
              @keyframes heroGlow {
                0%,100% { transform: scale(1);   opacity: 0.6; }
                50%      { transform: scale(1.15); opacity: 1;   }
              }
              @keyframes heroFloat {
                0%,100% { transform: translateY(0px); }
                50%      { transform: translateY(-14px); }
              }
            `}</style>
            <video
              src="/videos/hero-medi-21 (1).mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto object-cover max-w-lg mx-auto relative z-10"
              style={{ animation: 'heroFloat 6s ease-in-out infinite' }}
            />
          </div>
        </main>
      </div>

      {/* the original videos  */}
      <div className="mt-20 px-4 max-w-7xl mx-auto">
        <h3 className="text-4xl font-bold text-center text-red-800 mb-10">
          What people say-
        </h3>

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
                  poster={review.thumbnailUrl} //
                />
              </div>
              <div className="mt-3">
                <p className="text-lg font-semibold">{review.name}</p>
                <p className="text-sm text-gray-600">
                  {review.role}
                </p>
                <p className="mt-2 text-sm italic text-gray-800">
                  "{review.review}"
                </p>
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
