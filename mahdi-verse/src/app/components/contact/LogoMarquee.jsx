// Works as a Server or Client component — no React state/hooks used,
// the scrolling is pure CSS animation.

import Image from "next/image";

// Demo data — replace with your database array. Expected shape per item:
// { name: "Walmart", src: "https://.../walmart.svg" }
// `src` is optional — if a logo has no image yet, the name renders as a text wordmark instead.

const DEFAULT_LOGOS = [
  { name: "Walmart" },
  { name: "AT&T" },
  { name: "Allianz" },
  { name: "Volkswagen" },
  { name: "Xfinity" },
  { name: "Wells Fargo" },
  { name: "J.P. Morgan" },
];

export default function LogoMarquee({
  logos = DEFAULT_LOGOS,
  speed = 28, // seconds per full loop — lower = faster
  direction = "left", // "left" | "right"
  pauseOnHover = true,
}) {
  // duplicate the list once so translateX(-50%) lines up perfectly for a seamless loop
  const track = [...logos, ...logos];

  return (
    <div className="relative py-space-6 w-full min-w-0">
      <style>{`
        @keyframes marqueeLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .marquee-track {
          animation: ${direction === "right" ? "marqueeRight" : "marqueeLeft"} ${speed}s linear infinite;
        }
        ${pauseOnHover ? `.marquee-wrapper:hover .marquee-track { animation-play-state: paused; }` : ""}
        .marquee-wrapper {
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
        .marquee-logo {
          filter: grayscale(100%);
          opacity: 0.55;
          transition: filter 0.2s ease, opacity 0.2s ease;
        }
        .marquee-logo:hover {
          filter: grayscale(0%);
          opacity: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>

      <div className="marquee-wrapper overflow-hidden w-full min-w-0">
        <div className="marquee-track flex items-center gap-space-9">
          {track.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="marquee-logo shrink-0 flex items-center justify-center"
            >
              {logo.src ? (
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={200}
                  height={40}
                  className="h-8 w-auto object-cover"
                />
              ) : (
                <span className="text-placeholder_2 font-semibold text-2xl whitespace-nowrap cursor-alias">
                  {logo.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
