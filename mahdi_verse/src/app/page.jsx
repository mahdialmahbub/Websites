import Image from "next/image";
import Link from "next/link";
import { assets } from "./assets/assets";
import Button from "./components/Button";
import {
  HeroAvatar,
  HeroOrbitIcon,
  HeroItem,
} from "./components/motions/HeroMotion";
import JsonLd from "./components/JsonLd";
import { homeSchema } from "./utils/schema";

// x, y = image-er center theke offset (px). 150px image + 52px icon er hishab e.
const techIcons = [
  { name: "Node.js", src: assets.Node_js, x: -105, y: -85 }, // top left
  { name: "React", src: assets.React_js, x: 105, y: -85 }, // top right
  { name: "Next.js", src: assets.nextjs, x: -129, y: 0 }, // middle left
  { name: "Redux", src: assets.redux, x: 129, y: 0 }, // middle right
  { name: "Figma", src: assets.figma, x: -105, y: 85 }, // bottom left
  { name: "VS Code", src: assets.Visual_Studio_Code, x: 105, y: 85 }, // bottom right
];

const count = [
  { label: "Years of Experience", number: "5", icon: "fi fi-sr-briefcase" },
  { label: "Completed Projects", number: "100", icon: "fi fi-sr-browser" },
  { label: "Happy Clients", number: "50", icon: "fi fi-sr-employee-man-alt" },
];

const page = () => {
  return (
    <>
    <JsonLd data={homeSchema()} />
    <div className="flex flex-col items-center justify-center">
      {/* image + tech icons + badge */}
      <div className="px-2.5 flex flex-col items-center justify-center relative gap-12.5">
        <div className="relative">
          <HeroAvatar>
            <Image
              alt="Mahdi, UI/UX Designer and Next.js Developer"
              src="/profile.jpg"
              priority
              width={150}
              height={150}
              className="rounded-full w-37.5 h-auto object-cover"
            />
          </HeroAvatar>

          {techIcons.map((icon, i) => (
            <HeroOrbitIcon key={icon.name} index={i} x={icon.x} y={icon.y}>
              <Image
                alt={`${icon.name} logo`}
                src={icon.src}
                height={100}
                width={100}
                className="h-6.25 w-auto"
              />
            </HeroOrbitIcon>
          ))}
        </div>

        <HeroItem
          stage="badge"
          className="flex items-center justify-center gap-space-2 px-space-7 py-space-2 rounded-xl max-w-max border border-[#00DE00]/10 bg-[#00DE00]/5"
        >
          <div className="relative size-4 shrink-0">
            {/* Ping animation */}
            <span className="absolute inset-0 rounded-full bg-green-500/50 animate-ping" />
            {/* Main circle */}
            <span className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500" />
          </div>

          <p className="font-primary font-semibold text-size-sm text-[#00DE00]">
            Available for work
          </p>
        </HeroItem>
      </div>

      {/* content */}
      <div className="flex flex-col items-center gap-space-6 mt-space-6">
        <div className="flex flex-col items-center gap-space-4">
          <div className="flex flex-col items-center text-center gap-space-2">
            <HeroItem
              as="h1"
              stage="title"
              className="font-primary text-size-2xl font-bold"
            >
              Designing Experiences, Building
              <br />
              <span className="bg-linear-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
                Modern Web Interfaces
              </span>
            </HeroItem>

            <HeroItem
              as="p"
              stage="subtitle"
              className="text-size-base text-placeholder_2 dark:text-placeholder w-162.5"
            >
              I’m Mahdi — a UI/UX Designer and Next.js Frontend Developer
              focused on creating aesthetic, user-centered, and high-performance
              digital experiences that feel smooth, modern, and impactful.
            </HeroItem>
          </div>

          <HeroItem stage="cta">
            <Link href="/about">
              <Button
                text="About me"
                rightIcon
                icon="fi fi-rr-arrow-small-right"
              />
            </Link>
          </HeroItem>
        </div>

        <HeroItem stage="stats" className="flex items-center gap-space-7">
          {count.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-space-2 px-space-6 w-60"
            ></div>
          ))}
        </HeroItem>
      </div>
    </div></>
  );
};

export default page;