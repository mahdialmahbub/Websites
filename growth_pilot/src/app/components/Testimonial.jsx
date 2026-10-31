/* eslint-disable @next/next/no-img-element */
import React from "react";
import SectionHeading from "./SectionHeading";
import TestimonialCard from "./TestimonialCard";
import FadeUp from "./motions/FadeUp";
import MarqueeTrack from "./motions/MarqueeTrack";

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
    <section className="flex flex-col items-center py-[clamp(3rem,1.9091rem+5.4545vw,6rem)] px-[clamp(1rem,-0.0909rem+5.4545vw,4rem)] ">
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

            /* Below xl: press (hold) to pause. data-pressed is set by MarqueeTrack */
            @media (max-width: 79.99rem) {
                .marquee-inner[data-pressed="true"] {
                    animation-play-state: paused;
                }
            }

            /* xl and above: hover to pause */
            @media (min-width: 80rem) {
                .marquee-row:hover .marquee-inner {
                    animation-play-state: paused;
                }
            }
        `}</style>
      <SectionHeading
        title={"Loved by Marketers Worldwide"}
        subtitle={
          "See how businesses like yours are growing faster with GrowthPilot."
        }
        tagName={"Testimonial"}
      />

      <FadeUp className="marquee-row w-full overflow-x-hidden relative ">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white dark:from-black to-transparent"></div>
        <MarqueeTrack className="marquee-inner flex transform-gpu min-w-[200%] space-x-[clamp(1.5rem,1.3182rem+0.9091vw,2rem)] max-xl:select-none max-xl:[-webkit-touch-callout:none] py-[clamp(1.5rem,0.9545rem+2.7273vw,3rem)]">
          {[...cardsData, ...cardsData].map((card, index) => (
            <TestimonialCard key={index} card={card} />
          ))}
        </MarqueeTrack>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white dark:from-black to-transparent"></div>
      </FadeUp>
      <div className="flex items-center justify-center gap-space-xs *:opacity-30 animate-pulse">
        <i className="fi fi-rr-pause-circle text-[18px]" aria-hidden="true"></i>
        <p className="text-medium font-medium xl:hidden">Press to Pause</p>
        <p className="text-medium font-medium max-xl:hidden">Hover to Pause</p>
      </div>
    </section>
  );
};

export default Testimonial;
