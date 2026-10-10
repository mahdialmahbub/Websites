"use client";

import { useState } from "react";

import Education from "@/app/components/builder/Education";
import Experience from "@/app/components/builder/Experience";
import ImageUpload from "@/app/components/builder/ImageUpload";
import Language from "@/app/components/builder/Language";
import Project from "@/app/components/builder/Project";
import Reference from "@/app/components/builder/Reference";
import Skill from "@/app/components/builder/Skill";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import ProfileNavbar from "@/app/components/profile/ProfileNav";
import { Textarea } from "@/app/components/Textarea";
import ThemeCard from "@/app/components/builder/ThemeCard";
import ColorSelect from "@/app/components/builder/ColorSelect";

const navItems = [
  { key: "Personal Information", text: "Personal Information" },
  { key: "Professional Summary", text: "Professional Summary" },
  { key: "Work Experience", text: "Work Experience" },
  { key: "Education", text: "Education" },
  { key: "Skill", text: "Skill" },
  { key: "Project", text: "Project" },
  { key: "Language", text: "Language" },
  { key: "Reference", text: "Reference" },
];

const pageGap =
  "gap-[clamp(0.75rem,calc(0.751vw+0.574rem),1.25rem)]";

const Page = () => {
  const [active, setActive] = useState(navItems[0].key);

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-200
        min-w-0
        p-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)]
        space-y-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)]
        md:my-8
        md:rounded-xl
        md:border
        md:border-neutral-500/20
      "
    >
      {/* Profile image, name and professional title */}

      <div
        className="
          flex
          items-center
          gap-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)]
          max-md:flex-col
          *:flex-1
        "
      >
        <ImageUpload className="max-md:mb-6.5" />
        <div
          className="
            w-full
            space-y-space-8
            rounded-lg
            border
            border-neutral-500/20
            px-space-3
            py-space-4
          "
        >
          <Input
            label="Full Name"
            labelIcon="fi fi-rr-user"
            placeholder="John Doe"
          />

          <Input
            label="Professional Title"
            labelIcon="fi fi-rr-briefcase"
            placeholder="Frontend Developer"
          />
        </div>
      </div>

      {/* Navigation */}

      <div
        className="
          flex
          gap-[clamp(1rem,calc(1.502vw+0.648rem),2rem)]
        "
      >
        <ProfileNavbar
          items={navItems}
          activeKey={active}
          onChange={setActive}
        />
        
      </div>

      {/* Personal Information */}

      <section
        className={
          active === "Personal Information"
            ? "space-y-space-8 mb-0 *:w-full"
            : "hidden"
        }
      >
        <Input
          label="Email Address"
          labelIcon="fi fi-rr-envelope"
          placeholder="youremail@gmail.com"
        />

        <Input
          label="Phone Number"
          labelIcon="fi fi-rr-phone-flip"
          placeholder="+880 1XXXXXXXXX"
        />

        <Input
          label="Location"
          labelIcon="fi fi-rr-marker"
          placeholder="Dhaka, Bangladesh"
        />

        <Input
          label="LinkedIn Profile"
          labelIcon="fi fi-rr-briefcase"
          placeholder="https://linkedin.com/in/yourname"
        />

        <Input
          label="Personal Website"
          labelIcon="fi fi-rr-site-alt"
          placeholder="https://yourwebsite.com"
        />
      </section>

      {/* Professional Summary */}

      <section
        className={
          active === "Professional Summary"
            ? `flex flex-col mb-0 ${pageGap}`
            : "hidden"
        }
      >
        
        <div className="flex flex-col items-end gap-space-2">
          <Textarea
            label="Summary"
            placeholder="Write a professional summary highlighting your experience, key skills, and career goals..."
          />

          <Button
            variant="text"
            className="self-end"
            icon="fi fi-rr-magic-wand"
          >
            AI Enhance
          </Button>
        </div>

        <div
          className="
            rounded-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)]
            bg-blue-500/5
            p-[clamp(0.5rem,calc(0.751vw+0.324rem),1rem)]
            text-center
            text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)]
            text-blue-500
          "
        >
          <p className="leading-[clamp(1.25rem,calc(0.188vw+1.206rem),1.375rem)]">
            Tip: Highlight your experience, strongest skills, and what you
            can bring to the role. Keep it clear, specific, and relevant
            to the job.
          </p>
        </div>
      </section>

      {/* Work Experience */}

      <section
        className={
          active === "Work Experience"
            ? `flex flex-col mb-0 ${pageGap}`
            : "hidden"
        }
      >
        <Experience />
      </section>

      {/* Education */}

      <section
        className={
          active === "Education"
            ? `flex flex-col mb-0 ${pageGap}`
            : "hidden"
        }
      >
        <Education />
      </section>

      {/* Skills */}

      <section
        className={
          active === "Skill"
            ? `flex flex-col mb-0 ${pageGap}`
            : "hidden"
        }
      >
        <Skill />
      </section>

      {/* Projects */}

      <section
        className={
          active === "Project"
            ? `flex flex-col mb-0 ${pageGap}`
            : "hidden"
        }
      >
        <Project />
      </section>

      {/* Languages */}

      <section
        className={
          active === "Language"
            ? `flex flex-col mb-0 ${pageGap}`
            : "hidden"
        }
      >
        <Language />
      </section>

      {/* References */}

      <section
        className={
          active === "Reference"
            ? `flex flex-col mb-0 ${pageGap}`
            : "hidden"
        }
      >
        <Reference />
      </section>
    </main>
  );
};

export default Page;