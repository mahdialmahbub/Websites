import React from "react";
import { Button } from "../components/Button";
import Link from "next/link";
import BuilderHeader from "../components/builder/FieldCardHeader";
import FormHeader from "../components/builder/FormHeader";
import PersonalInformation from "../components/builder/PersonalInformation";
import ProfessionalSummary from "../components/builder/ProfessionalSummary";
import Experience from "../components/builder/Experience";
import Project from "../components/builder/Project";
import Skill from "../components/builder/Skill";
import Education from "../components/builder/Education";
import Language from "../components/builder/Language";
import Reference from "../components/builder/Reference";
import Suggestion from "../components/builder/Suggestion";
import PreviewandScore from "../components/builder/PreviewandScore";

const page = () => {
  return (
    <main className="px-[clamp(1rem,calc(6.009vw-0.409rem),5rem)] gap-[clamp(0.8125rem,calc(1.221vw+0.526rem),1.625rem)] py-[clamp(2rem,calc(3.380vw+1.208rem),4.25rem)] flex flex-col  max-w-300 min-w-[320px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={"/"}>
          <button className="h-11 flex items-center gap-[clamp(0.375rem,calc(0.188vw+0.331rem),0.5rem)] text-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)] font-primary font-medium text-neutral-500">
            <i className="fi fi-rr-arrow-small-left text-[clamp(1rem,calc(0.563vw+0.868rem),1.375rem)]"></i>
            Back to home
          </button>
        </Link>
        <div className="hidden md:flex items-center gap-3.25">
          <Button
            variant="secondary"
            icon="fi fi-rr-hard-disk-scan"
            className="bg-violet-500/5 text-violet-500 hover:bg-violet-500/10"
          >
            ATS Score
          </Button>
          <Button
            variant="secondary"
            icon="fi fi-rr-file-download"
            className="bg-green-500/5 text-green-500 hover:bg-green-500/10"
          >
            Download
          </Button>
        </div>
      </div>

      <div className="flex max-md:flex-col gap-5.5 max-md:items-center">
        {/* builder */}
        <section className="flex gap-5.5 max-md:flex-col max-md:items-center w-full">
          {/* form */}
          <div className="max-w-130 w-full rounded-[clamp(0.5rem,calc(0.939vw+0.28rem),1.125rem)] border border-neutral-500/10 shadow-[0_6px_8px_rgba(2,6,23,0.10)] bg-white p-[clamp(0.8125rem,calc(0.657vw+0.658rem),1.25rem)] pt-[clamp(0.25rem,calc(0.188vw+0.206rem),0.375rem)] relative overflow-hidden">
            {/* Progress */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[clamp(0.25rem,calc(0.188vw+0.206rem),0.375rem)] bg-green-500/10">
              <span className="block h-full w-1/2 bg-green-500 rounded-full"></span>
            </div>

            {/* form header */}
            <div className="flex items-center justify-between border-b border-neutral-500/10 py-[clamp(0.5rem,calc(0.751vw+0.324rem),1rem)]">
              <div className="flex items-center gap-space-2 mb-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)]">
                <Button varient></Button>
              </div>
            </div>
            <div className=" flex flex-col gap-[clamp(1.25rem,calc(1.127vw+0.986rem),2rem)]">
              {/* title and subtitle */}
              <FormHeader />
              <Reference />

              <div className="flex items-center *:flex-1 gap-[clamp(1rem,calc(0.939vw+0.780rem),1.625rem)]">
                <Button variant="text"></Button>

                <Button variant="secondary" iconPosition="right"></Button>
              </div>
            </div>
          </div>
        </section>
        <PreviewandScore />
      </div>
    </main>
  );
};

export default page;
