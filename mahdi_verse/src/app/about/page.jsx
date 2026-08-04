import React from "react";
import Button from "../components/Button";
import Image from "next/image";
import { assets } from "../assets/assets";

const page = () => {
  const aboutMeLabel = [
    "Expect a response from us within 24 hours",
    "We’re happy to sign an NDA upon request.",
    "Get access to a team of dedicated product specialists.",
  ];

  const aboutMeContent = [
    {
      image: "https://images.unsplash.com/photos/3d-abstract-shapes-and-emojis-on-purple-background-zrOBY-0hF-g",
      title: "UI UX design",
      subtitle:
        "I'm a UI/UX and Product Designer who creates user-centered websites that balance great design with real business goals.",
      descripiton:
        "Beyond design, I also build responsive frontends using React, Next.js, and Redux, ensuring every detail is implemented as intended. By handling both design and development, I streamline the process, reduce communication gaps, and deliver a smoother experience from concept to launch.",
    },
    {
      image: "https://images.unsplash.com/photos/silver-imac-turned-on-inside-room-DtDlVpy-vvQ",
      title: "MERN stact website development",
      subtitle:
        "I'm a UI/UX and Product Designer who creates user-centered websites that balance great design with real business goals.",
      descripiton:
        "Beyond design, I also build responsive frontends using React, Next.js, and Redux, ensuring every detail is implemented as intended. By handling both design and development, I streamline the process, reduce communication gaps, and deliver a smoother experience from concept to launch.",
    },
  ];

  return (
    <section className="min-w-full">
      <div className="w-full bg-foreground flex items-center gap-space-6 rounded-[12px] p-space-7 relative">
        {/* content */}
        <div className="w-full">
          <div>
            <div className="rounded-full px-space-3 py-space-3 mb-space-3 font-primary font-semibold text-size-xs_2 bg-secondary-800/10 text-secondary-50 max-w-max">
              UI/UX Design • MERN stack website development
            </div>
            <h1 className="font-primary font-semibold text-size-2xl mb-space-5 text-background">
              Designing Experiences, Building Websites
            </h1>
            <p className="font-medium text-[18px] text-placeholder">
              I&apos;m a UI/UX and Product Designer who creates user-centered
              websites that balance great design with real business goals.
            </p>
            <div className="flex flex-col gap-space-4 mt-space-7 mb-space-7">
              {aboutMeLabel.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Image
                    alt="checkBox"
                    width={22}
                    height={22}
                    src={assets.CheckBox}
                  />
                  <p className="font-medium text-size-md text-placeholder">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-space-4">
            <Button text={"Intro Video"} />
            <Button text={"Download Resume"} />
          </div>
        </div>
        <div className="relative">
          {/* overlay */}
          <div className="absolute inset-0 bg-conic from-primary-500 to-secondary-500 rounded-[12px] blur-[20px] z-0 "></div>

          <Image
            alt="about"
            src={assets.about}
            width={600}
            height={400}
            className="z-20"
          />
        </div>
      </div>
      <h2 className="font-primary font-semibold text-size-lg mt-space-7 mb-space-7 ">
        Why I choose these professions
      </h2>
      <div className="space-y-space-6">
        {aboutMeContent.map((item, i) => (
          <div
            key={i}
            className="bg-secondary-50 flex items-center gap-space-6 p-space-7 rounded-[12px] border border-secondary-500/20"
          >
            <Image width={200} height={140} src={item.image} alt="image" />
            <div >
                <h3 className="font-primary font-semibold text-size-md mb-space-5">{item.title}</h3>
                <h4 className="font-medium text-size-sm mb-[10px]">{item.subtitle}</h4>
                <p className="font-medium text-size-sm text-placeholder_2 mb-space-5">{item.descripiton}</p>
                <Button variant="text" text={"View Workflow"} rightIcon />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default page;
