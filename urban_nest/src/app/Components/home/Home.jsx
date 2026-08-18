import React from "react";
import Button from "../Button";
import Image from "next/image";
import { assets } from "@/app/assets/assets";
import FadeLeft from "../motions/FadeLeft";
import FadeRight from "../motions/FadeRight";

const Home = () => {
  return (
    <section className="px-space-9 min-h-screen flex items-center justify-center w-[1440px] container mx-auto">
      <div className="py-space-8 px-space-7 flex items-center justify-between h-120.5 relative min-w-full">
        {/* overlay */}
        <div className="absolute inset-0 w-full h-120.5 bg-black/60 z-9"></div>
        <video
          className="absolute inset-0 w-full h-120.5 object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* texts and button */}
        <div className="max-w-125 z-10 hero-text">
          <FadeLeft
            as="h1"
            className="font-primary font-medium text-[58px] text-background mb-space-3"
          >
            Find Your Dream Property With AI
          </FadeLeft>
          <FadeLeft
            as="p"
            delay={0.2}
            className="text-lg text-background/70 font-medium mb-space-5"
          >
            Discover high-potential properties, predict future value. and make
            smarter real estate decisions.
          </FadeLeft>

          <FadeLeft delay={0.4}>
            <Button
              text={"View Properties"}
              type={"primary"}
              className="hero-button"
            />
          </FadeLeft>
        </div>

        {/* Images */}
        <FadeRight delay={0.2} className="z-10">
          <Image
            src={assets.HeroImage}
            alt="Hero Image"
            width={500}
            height={300}
            className="h-full w-auto hero-images"
          />
        </FadeRight>
      </div>
    </section>
  );
};

export default Home;
