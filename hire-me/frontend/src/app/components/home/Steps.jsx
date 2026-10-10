import React from "react";

const stepContent = [
  {
    icon: "fi fi-rr-attention-detail",
    color: "#9333EA",
    title: "Enter Your Details",
    subtitle: "Provide your information to get started quickly and accurately.",
  },
  {
    icon: "fi fi-rr-file-download",
    color: "#D97706",
    title: "Creative Styles",
    subtitle: "Discover beautifully crafted styles designed for every purpose.",
  },
  {
    icon: "fi fi-rr-file-invoice",
    color: "#0284C7",
    title: "Download & Use Anywhere",
    subtitle: "Save, download, and access your designs wherever you go.",
  },
];

// Fluid values: choto value = 375px screen, boro value = 1440px screen (1rem = 16px)
// clamp(min, calc(intercept + slope * vw), max): min shobshomoy choto, max shobshomoy boro.
const Steps = () => {
  return (
    <section className="mx-auto flex items-start justify-center max-sm:flex-col max-sm:max-w-56.25 sm:gap-x-[clamp(1rem,calc(10.5vw-3.2rem),6.25rem)] *:w-full *:max-w-57.5 px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)]">
      {stepContent.map((item) => (
        <div
          key={item.title}
          className="flex flex-col items-center gap-[clamp(0.625rem,calc(0.188vw+0.581rem),0.75rem)] p-[clamp(1.25rem,calc(0.376vw+1.162rem),1.5rem)]"
        >
          {/* Icon: colored ring (padding) + white circle. Ring = 4.5px -> 9px, tai total 42px -> 82px */}
          <div
            className="rounded-full p-[clamp(0.281rem,calc(0.423vw+0.182rem),0.563rem)]"
            style={{
              background: `color-mix(in srgb, ${item.color} 15%, transparent)`,
            }}
          >
            <span
              className="flex items-center justify-center size-[clamp(2.0625rem,calc(2.911vw+1.38rem),4rem)] bg-white/80 rounded-full"
              style={{
                border: `0.5px solid color-mix(in srgb, ${item.color} 20%, transparent)`,
                boxShadow: `0 0 6px 0 color-mix(in srgb, ${item.color} 25%, transparent)`,
              }}
            >
              <i
                aria-hidden="true"
                className={`leading-none text-[clamp(0.875rem,calc(1.502vw+0.523rem),1.875rem)] ${item.icon}`}
                style={{ color: item.color }}
              ></i>
            </span>
          </div>

          {/* Text */}
          <div className="space-y-[clamp(0.25rem,calc(0.188vw+0.206rem),0.375rem)] *:text-center">
            <h3 className="font-semibold text-neutral-950 text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)]">
              {item.title}
            </h3>
            <p className="text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] text-neutral-400">
              {item.subtitle}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Steps;
