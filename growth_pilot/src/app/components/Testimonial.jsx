/* eslint-disable @next/next/no-img-element */
import React from "react";
import SectionHeading from "./SectionHeading";
import TestimonialCard from "./TestimonialCard";
import FadeUp from "./motions/FadeUp";

const Testimonial = () => {
  const cardsData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Briar Martin",
      handle: "@neilstellar",
      text: "Amazing experience! The service was smooth, fast, and very easy to use.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Avery Johnson",
      handle: "@averywrites",
      text: "Really impressed with the quality and attention to detail. Highly recommended!",
      rating: 4.5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
      name: "Jordan Lee",
      handle: "@jordantalks",
      text: "Everything worked perfectly and the overall experience was excellent.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
      name: "Mia Anderson",
      handle: "@miaanderson",
      text: "Great platform with a clean interface. I would definitely use it again.",
      rating: 4,
    },
  ];

  return (
    <section className="section">
      <style>{`
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }

            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }
        `}</style>
      <SectionHeading
        title={"What Our Customers Say"}
        subtitle={"Real feedback from our amazing users"}
        tagName={"Testimonial"}
      />

      <FadeUp className="marquee-row w-full overflow-x-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white dark:from-black to-transparent"></div>
        <div className="marquee-inner flex transform-gpu min-w-[200%] ">
          {[...cardsData, ...cardsData].map((card, index) => (
            <TestimonialCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white dark:from-black to-transparent"></div>
      </FadeUp>
      <FadeUp className="marquee-row w-full overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white dark:from-black to-transparent"></div>
        <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] ">
          {[...cardsData, ...cardsData].map((card, index) => (
            <TestimonialCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white dark:from-black to-transparent"></div>
      </FadeUp>
    </section>
  );
};

export default Testimonial;
