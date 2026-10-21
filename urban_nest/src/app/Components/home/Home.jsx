import React from "react";
import Button from "../Button";
import Image from "next/image";
import { assets } from "@/app/assets/assets";
import FadeLeft from "../motions/FadeLeft";
import FadeRight from "../motions/FadeRight";

const Home = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-0 bg-black/55"
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-360 px-space-10">
        <div className="flex items-center justify-between gap-16">
          {/* Text */}
          <div className="hero-text w-full max-w-125 text-center lg:text-left">
            <FadeLeft
              as="h1"
              className="mb-space-3 font-primary text-4xl font-medium leading-tight tracking-tight text-background sm:text-5xl lg:text-6xl"
            >
              Find Your Dream Property With AI
            </FadeLeft>

            <FadeLeft
              as="p"
              delay={0.2}
              className="mb-space-5 max-w-md text-[20px] leading-[32px] text-background/70"
            >
              Discover high-potential properties, predict future value, and
              make smarter real estate decisions.
            </FadeLeft>

            <FadeLeft
              delay={0.4}
              className="flex justify-center lg:justify-start"
            >
              <Button
                text="View Properties"
                type="primary"
                className="hero-button"
              />
            </FadeLeft>
          </div>

          {/* Image */}
          <FadeRight
            delay={0.2}
            className="w-full max-w-[320px] shrink-0 sm:max-w-sm lg:max-w-md"
          >
            <Image
              src={assets.HeroImage}
              alt="Property recommended by AI"
              width={500}
              height={300}
              priority
              className="hero-images h-auto w-full rounded-lg object-cover shadow-2xl"
            />
          </FadeRight>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 opacity-50 transition-opacity duration-300 hover:opacity-100">
        <div className="flex flex-col items-center gap-2 font-primary font-bold text-background animate-pulse">
          <div className="h-6 w-2 rounded-full bg-background/80" />
          <span className="text-lg">Scroll</span>
        </div>
      </div>
    </section>
  );
};

export default Home;