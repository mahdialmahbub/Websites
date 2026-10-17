"use client";

import React, { useState } from "react";
import { Button } from "../Button";
import Image from "next/image";
import Suggestion from "./Suggestion";
import CircularScore from "./CircularScore";
import BreakdownProgress from "./BreakdownProgress";
import BuilderPreview from "./BuilderPreview";

const PreviewandScore = ({ suggestions = [{ f: "f" }] }) => {
  const [isScore, setIsScore] = useState(false);

  return (
    <section className="flex flex-col gap-space-3 items-end w-full">
      <div className="flex md:hidden gap-space-3 ">
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
      {isScore ? (
        <div className="flex flex-col gap-[clamp(1.5rem,calc(1.502vw+1.148rem),2.5rem)] p-[clamp(1rem,calc(0.376vw+0.912rem),1.25rem)] rounded-[clamp(0.5rem,calc(0.939vw+0.28rem),1.125rem)] border border-neutral-500/10 shadow-[0_6px_8px_rgba(2,6,23,0.10)] w-full">
          {/* score */}
          <CircularScore value={98} label="Excellent" />

          {/* suggestions */}
          <div>
            <h3 className="mb-[clamp(1rem,calc(0.751vw+0.824rem),1.5rem)] text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] text-neutral-500/80 font-medium opacity-60">
              Suggestions
            </h3>
            <div className="mb-[clamp(1.25rem,calc(0.376vw+1.162rem),1.5rem)] flex gap-[clamp(0.5rem,calc(0.751vw+0.324rem),1rem)]"></div>
            <div className="flex flex-col gap-[clamp(0.75rem,calc(0.563vw+0.618rem),1.125rem)]">
              {suggestions.map((item, i) => {
                const {
                  title,
                  subtitle,
                  improvedVersion,
                  whyThisImprovement,
                  whatImproved,
                } = item;
                return (
                  <Suggestion
                    key={i}
                    title={title}
                    subtitle={subtitle}
                    improvedVersion={improvedVersion}
                    whyThisImprovement={whyThisImprovement}
                    whatImproved={whatImproved}
                  />
                );
              })}
            </div>
          </div>

          {/* suggestions */}
          <div>
            <h3 className="mb-[clamp(1rem,calc(0.751vw+0.824rem),1.5rem)] text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] text-neutral-500/80 font-medium opacity-60">
              Score Breakdown
            </h3>
            
            <div className="flex flex-col gap-space-3">
              <BreakdownProgress title="baler title" score={55} />
            </div>
          </div>
        </div>
      ) : (
        <BuilderPreview/>
      )}
    </section>
  );
};

export default PreviewandScore;
