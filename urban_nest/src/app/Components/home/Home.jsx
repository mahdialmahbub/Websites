import React from "react";
import Button from "../Button";
import Image from "next/image";
import { assets } from "@/app/assets/assets";
import FadeLeft from "../motions/FadeLeft";
import FadeRight from "../motions/FadeRight";

const Home = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay for text legibility */}
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

      {/* Text + image */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-space-5 sm:px-space-7 lg:px-space-9 py-space-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text */}
          <div className="hero-text w-full max-w-125 text-center lg:text-left">
            <FadeLeft
              as="h1"
              className="font-primary font-medium text-background text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight mb-space-3"
            >
              Find Your Dream Property With AI
            </FadeLeft>

            <FadeLeft
              as="p"
              delay={0.2}
              className="text-lg text-background/70 font-medium mb-space-5 max-w-md mx-auto lg:mx-0"
            >
              Discover high-potential properties, predict future value, and
              make smarter real estate decisions.
            </FadeLeft>

            <FadeLeft delay={0.4} className="flex justify-center lg:justify-start">
              <Button
                text={"View Properties"}
                type={"primary"}
                className="hero-button"
              />
            </FadeLeft>
          </div>

          {/* Image */}
          <FadeRight
            delay={0.2}
            className="w-full max-w-[320px] sm:max-w-sm lg:max-w-md shrink-0"
          >
            <Image
              src={assets.HeroImage}
              alt="Property recommended by AI"
              width={500}
              height={300}
              className="w-full h-auto object-cover rounded-lg shadow-2xl hero-images"
              priority
            />
          </FadeRight>
        </div>
      </div>
    </section>
  );
};

export default Home;