import React from "react";
import LazyVideo from "../builder/LazyVideo";

const stepContent = [
  {
    icon: "fi fi-rr-template",
    color: "#9333EA",
    title: "Start with a Title, Find Your Match",
    subtitle:
      "Enter your resume title and get personalized template suggestions. Choose any template you like.",
  },
  {
    icon: "fi fi-rr-magic-wand",
    color: "#D97706",
    title: "Add Your Details, Let AI Do the Magic",
    subtitle:
      "Add your information and let AI create, enhance, and polish your descriptions.",
  },
  {
    icon: "fi fi-rr-file-download",
    color: "#0284C7",
    title: "Your Resume Is Ready to Make an Impact",
    subtitle:
      "Download your professional resume and start applying with confidence.",
  },
];

const Steps = () => {
  return (
    <section
      className="
        mx-auto w-full max-w-300
        px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)]
      "
    >
      <div
        className="
          mx-auto flex w-full max-w-200 flex-col items-center gap-8
          sm:flex-row sm:items-start sm:justify-center
          sm:gap-[clamp(1rem,calc(10.5vw-3.2rem),3rem)]
        "
      >
        {/* Steps */}
        <div
          className="
            flex w-full max-w-70 flex-col items-center gap-2
            sm:w-70 sm:shrink-0 sm:items-center
            sm:gap-y-[clamp(1rem,calc(10.5vw-3.2rem),4rem)]
          "
        >
          {stepContent.map((item) => (
            <div
              key={item.title}
              className="
                flex w-full flex-col items-center
                gap-[clamp(0.625rem,calc(0.188vw+0.581rem),0.75rem)]
                p-[clamp(1.25rem,calc(0.376vw+1.162rem),1.5rem)]
              "
            >
              <div
                className="shrink-0 rounded-full p-[clamp(0.4rem,calc(0.423vw+0.182rem),0.563rem)]"
                style={{
                  background: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                }}
              >
                <span
                  className="flex size-[clamp(3rem,calc(2.911vw+1.38rem),4rem)] items-center justify-center rounded-full bg-white/80"
                  style={{
                    border: `0.5px solid color-mix(in srgb, ${item.color} 20%, transparent)`,
                    boxShadow: `0 0 6px 0 color-mix(in srgb, ${item.color} 25%, transparent)`,
                  }}
                >
                  <i
                    aria-hidden="true"
                    className={`leading-none text-[clamp(1.3rem,calc(1.502vw+0.523rem),1.875rem)] ${item.icon}`}
                    style={{ color: item.color }}
                  ></i>
                </span>
              </div>

              <div className="w-full space-y-[clamp(0.25rem,calc(0.188vw+0.206rem),0.375rem)] *:text-center">
                <h2 className="font-semibold text-neutral-950 text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)]">
                  {item.title}
                </h2>
                <p className="text-neutral-500 text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)]">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Video: mobile e niche, sm+ e right e sticky */}
        <div
          className="
            aspect-[9/16] h-[min(60svh,28rem)] shrink-0 overflow-hidden rounded-[24px]
            sm:sticky sm:h-[min(80svh,40rem)]
            sm:top-[clamp(3rem,calc(7.273vw+0.545rem),6rem)]
          "
        >
          <LazyVideo
            mp4="/HireMe.mp4"
            poster="/HireMe-poster.webp"
            label="HireMe resume builder demo"
            width={450}
            height={800}
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Steps;