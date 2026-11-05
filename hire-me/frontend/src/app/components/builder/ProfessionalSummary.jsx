"use client";

import React, { useState } from "react";
import { Textarea } from "../Textarea";
import AiEnhanceButton from "./AiEnhanceButton";
import { useSection } from "./useSection";
import { LIMITS } from "@/resume/validation";

const ProfessionalSummary = () => {
  const { value, dispatch, actions, field } = useSection("professionalSummary");
  const { setSection } = actions;
  const summaryField = field("professionalSummary");
  const [aiMessage, setAiMessage] = useState(null); // { type, text } | null

  const isError = aiMessage?.type === "error";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-end gap-space-1">
        <Textarea
          label="Summary"
          placeholder={"A creative graphic designer with over 5 years ..."}
          maxLength={LIMITS.summary}
          value={value}
          onChange={(event) =>
            dispatch(
              setSection({
                section: "professionalSummary",
                value: event.target.value,
              }),
            )
          }
          {...summaryField}
        />
        <AiEnhanceButton
          section="professionalSummary"
          onMessage={setAiMessage}
        />
      </div>

      <div
        role={aiMessage ? (isError ? "alert" : "status") : undefined}
        className={`p-[clamp(0.5rem,calc(0.751vw+0.324rem),1rem)] text-center rounded-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)] text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] ${
          isError ? "bg-red-500/5 text-red-600" : "bg-blue-500/5 text-blue-500"
        }`}
      >
        <p className="leading-[clamp(1.25rem,calc(0.188vw+1.206rem),1.375rem)]">
          {aiMessage
            ? aiMessage.text
            : "Tip: Highlight your experience, strongest skills, and what you can bring to the role. Keep it clear, specific, and relevant to the job."}
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummary;
