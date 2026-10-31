"use client";

import React from "react";
import { Button } from "../Button";
import BuilderPreview from "./BuilderPreview";
import AtsPanel from "./AtsPanel";

/**
 * The right-hand side of the builder. `showScore` switches between the live resume preview (default)
 * and the ATS score panel; the page owns that state because its header buttons toggle it too.
 *
 * Layout:
 *  - Same width as the form column (md:flex-1 md:basis-0 + min-w-0).
 *  - The card below has an automatic height. The preview gives itself an A4 ratio
 *    (see BuilderPreview), while the ATS panel simply grows with its content.
 */
const PreviewandScore = ({
  activeSection = "personalInformation",
  showScore = false,
  onToggleScore,
  onDownload,
}) => {
  const isScore = showScore;

  return (
    <section
      className={`flex flex-col gap-space-3 w-full min-w-0 md:flex-1 md:basis-0 md:sticky md:top-18 md:bottom-1`}
    >
      <div className="flex md:hidden gap-space-3 self-end">
        <Button
          variant="secondary"
          icon={isScore ? "fi fi-rr-eye" : "fi fi-rr-hard-disk-scan"}
          aria-pressed={isScore}
          onClick={onToggleScore}
          className="bg-violet-500/5 text-violet-500 hover:bg-violet-500/10 border-violet-500/10"
        >
          <span className="hidden sm:inline">
            {isScore ? "Preview" : "ATS Score"}
          </span>
        </Button>
        <Button
          variant="secondary"
          icon="fi fi-rr-file-download"
          onClick={onDownload}
          className="bg-green-500/5 text-green-500 hover:bg-green-500/10 border-green-500/5"
        >
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>

      {/* shared card: border / shadow / rounded live here, height is auto */}
      <div className="w-full min-w-0 overflow-hidden rounded-[clamp(0.5rem,calc(0.939vw+0.28rem),1.125rem)] border border-neutral-500/10 bg-white shadow-[0_6px_8px_rgba(2,6,23,0.10)]">
        {isScore ? (
          <AtsPanel activeSection={activeSection} />
        ) : (
          <BuilderPreview />
        )}
      </div>
    </section>
  );
};

export default PreviewandScore;
