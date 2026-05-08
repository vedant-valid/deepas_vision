"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Quote } from "lucide-react";
import SectionDivider from "@/components/SectionDivider";

const VideoReviewSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playingVideo, setPlayingVideo] = useState(null); // removed `: number | null`
    const [mutedVideos, setMutedVideos] = useState([]); // removed `: number[]`
    const videoRefs = useRef([]); // 

  const reviews = [
    {
      id: 1,
      name: "Pallavi",
      role: "Manager",
      company: "Taj Hotels",
      videoUrl: "/videos/review/pallavi taj hotel.mp4",
      review: "I didn't believe in remedies at first, but suddenly it all makes sense.",
    },
    {
      id: 2,
      name: "Riya Gandhi",
      role: "Psychology student",
      company: "College",
      videoUrl: "/videos/review/riya.mp4",
      review: "Outstanding quality and professional service. Highly recommend to everyone.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "CEO",
      company: "StartupXYZ",
      videoUrl: "/videos/review/review1.mp4",
      review: "Professional team that delivered exceptional results on time and budget.",
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Creative Director",
      company: "CreativeStudio",
      videoUrl: "/videos/review/review1.mp4",
      review: "Incredible attention to detail and creative solutions that exceeded our goals.",
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Operations Manager",
      company: "GlobalTech",
      videoUrl: "/videos/review/review1.mp4",
      review: "Seamless integration with fantastic ongoing support. Truly impressed.",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 3 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 3 : prev - 1));
  };

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

  return (
    <section id="bharosa" className="bg-gradient-to-b relative from-red-50 to-red-100 py-24 px-4 relative overflow-hidden">
      <SectionDivider />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-red-800/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -right-20 bottom-1/4 w-80 h-80 bg-red-800/10 rounded-full blur-3xl animate-float-medium"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.span
            className="inline-block mb-4 text-red-800 font-medium tracking-widest text-sm uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
          </motion.span>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            <motion.span
              className="relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Words of <span className="text-red-800">Joy</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-800/30 via-red-800 to-red-800/30"></span>
            </motion.span>
          </h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto relative px-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Quote className="absolute left-0 top-0 text-red-800/20 w-8 h-8" />
            Real moments, genuine smiles, and heartfelt memories — these are the little sparks that light up our lives with joy.
            <Quote className="absolute right-0 bottom-0 text-red-800/20 w-8 h-8 transform rotate-180" />
          </motion.p>
        </motion.div>

        {/* Navigation */}
        <button
          onClick={prevSlide}
          className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 backdrop-blur-md bg-white/70 hover:bg-red-800 hover:text-white text-red-800 border border-red-800 rounded-full p-3 shadow-xl transition-all duration-300"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={nextSlide}
          className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 backdrop-blur-md bg-white/70 hover:bg-red-800 hover:text-white text-red-800 border border-red-800 rounded-full p-3 shadow-xl transition-all duration-300"
        >
          <ChevronRight />
        </button>

        {/* Cards */}
        <div className="overflow-x-hidden py-8">
          <motion.div
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)`,
            }}
          >
            {reviews.map((review, index) => (
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.1}
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                scale={1.03}
                key={review.id}
                className="flex-none w-80"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: review.id * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/40 backdrop-blur-md border border-red-200 rounded-2xl p-2 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Video */}
                  <div className="relative group overflow-hidden rounded-xl shadow-md">
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      className="w-full h-full object-cover"
                      loop
                      muted
                      preload="metadata"
                    >
                      <source src={review.videoUrl} type="video/mp4" />
                    </video>

                    {/* Controls */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-300">
                      <button
                        onClick={() => togglePlay(index)}
                        className="text-white bg-red-800/80 p-2 rounded-full w-10 h-10"
                      >
                        {playingVideo === index ? <Pause /> : <Play />}
                      </button>
                      <button
                        onClick={() => toggleMute(index)}
                        className="text-white bg-red-800/80 p-2 rounded-full w-10 h-10"
                      >
                        {mutedVideos.includes(index) ? <VolumeX /> : <Volume2 />}
                      </button>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="p-6">
                    <p className="text-gray-800 italic mb-6 leading-relaxed">
                      “{review.review}”
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-red-700 to-red-900 text-white rounded-full flex items-center justify-center font-bold shadow-md ring-2 ring-white">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <p className="text-red-700 text-sm font-medium">
                          {review.role}, {review.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-10 space-x-2">
          {Array.from({ length: reviews.length - 2 }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-red-800 w-8" : "bg-gray-300 hover:bg-gray-400 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoReviewSection;
