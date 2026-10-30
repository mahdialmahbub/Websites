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
//
// Layout:
//  - < 640px  : column, card gulo center e, protita card max 280px
//  - >= 640px : row, card gulo equal width (flex-1), max 280px, gap 16px -> 100px
const Steps = () => {
  return (
    <section
      className="
        mx-auto flex w-full max-w-[90rem] flex-col items-center gap-y-2
        px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)]
        sm:flex-row sm:items-start sm:justify-center sm:gap-y-0
        sm:gap-x-[clamp(1rem,calc(10.5vw-3.2rem),6.25rem)]
      "
    >
      {stepContent.map((item) => (
        <div
          key={item.title}
          className="
            flex w-full max-w-[17.5rem] flex-col items-center sm:min-w-0 sm:flex-1
            gap-[clamp(0.625rem,calc(0.188vw+0.581rem),0.75rem)]
            p-[clamp(1.25rem,calc(0.376vw+1.162rem),1.5rem)]
          "
        >
          {/* Icon: colored ring (padding) + white circle. Ring = 4.5px -> 9px, tai total 42px -> 82px */}
          <div
            className="shrink-0 rounded-full p-[clamp(0.281rem,calc(0.423vw+0.182rem),0.563rem)]"
            style={{
              background: `color-mix(in srgb, ${item.color} 15%, transparent)`,
            }}
          >
            <span
              className="flex size-[clamp(2.0625rem,calc(2.911vw+1.38rem),4rem)] items-center justify-center rounded-full bg-white/80"
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
          <div className="w-full space-y-[clamp(0.25rem,calc(0.188vw+0.206rem),0.375rem)] *:text-center">
            <h3 className="font-semibold text-neutral-950 text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)]">
              {item.title}
            </h3>
            <p className="text-neutral-500 text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)]">
              {item.subtitle}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Steps;
