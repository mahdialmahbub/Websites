import React from "react";
import { Button } from "../Button";
import { icons } from "../../../../assets/iconCollection";
import { Textarea } from "../Textarea";

const RatingModal = () => {
  return (
    <div className="p-[clamp(1.5rem,calc(1.939vw+1.045rem),2.5rem)] rounded-xl max-w-152.5 w-[60%] flex flex-col gap-[clamp(1.5rem,calc(0.97vw+1.273rem),2rem)] bg-neutral-50 border-orange-500/10 shadow-[0_24px_48px_rgba(0,0,0,0.20)] min-w-45">
      {/* title and subtitle */}
      <div>
        <h2 className="text-[clamp(1.5rem,calc(0.485vw+1.386rem),1.75rem)] font-semibold font-primary mb-space-2">
          How was your experience?
        </h2>
        <p className="text-neutral-500 text-[clamp(1rem,calc(0.242vw+0.943rem),1.125rem)]">
          We’d love to hear what you think!
        </p>
      </div>

      {/* Experience */}
      <div className="flex items-center gap-space-4 *:flex-1">
        <Button
          icon={icons.bad}
          variant="secondary"
          className="bg-orange-500/5 hover:bg-orange-500/10 text-orange-500"
        >
          Bad
        </Button>
        <Button
          icon={icons.decent}
          variant="secondary"
          className="bg-violet-500/5 hover:bg-violet-500/10 text-violet-500"
        >
          Decent
        </Button>
        <Button
          icon={icons.happy}
          variant="secondary"
          className="bg-green-500/5 hover:bg-green-500/10 text-green-500"
        >
          Excellent
        </Button>
      </div>

      {/* feedback */}
      <Textarea placeholder="Tell us about your experience. What did you like, what could be improved, or how did our AI suggestions and templates help you create your resume?" />

      {/* title and subtitle */}
      <div className="flex items-center gap-space-4 *:flex-1">
        <Button
          variant="secondary"
          className="bg-red-500/5 hover:bg-red-500/10 text-red-500"
        >
          Cancel
        </Button>
        <Button>Send Feedback</Button>
      </div>
    </div>
  );
};

export default RatingModal;
