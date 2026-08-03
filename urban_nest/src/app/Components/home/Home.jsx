import React from "react";
import Button from "../Button";
import Image from "next/image";
import { assets } from "@/app/assets/assets";

const Home = () => {
  return (
    <section className="px-space-9 min-h-screen flex items-center justify-center w-[1440px] container mx-auto">
      <div className="py-space-8 px-space-7 flex items-center justify-between h-120.5 relative min-w-full">
        {/* overlay */}
        <div className='absolute inset-0 w-full h-120.5 bg-black/60 z-9'>

        </div>
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
          <h1 className="font-primary font-medium text-[58px] text-background mb-space-3 hero-title">
            Find Your Dream Property With AI
          </h1>
          <p className="text-lg text-background/70 font-medium mb-space-5 hero-subtitle">
            Discover high-potential properties, predict future value. and make
            smarter real estate decisions.
          </p>
          <Button text={"View Properties"} type={"primary"} className="hero-button" />
        </div>

        {/* Images */}
        <Image
          src={assets.HeroImage}
          alt="Hero Image"
          width={500}
          height={300}
          className="h-full w-auto z-10 hero-images"
        />
      </div>
    </section>
  );
};

export default Home;
