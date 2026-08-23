import PolicyCard from "@/app/components/settings/PolicyCard";
import StatusDot from "@/app/components/settings/StatusDot";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="mb-space-6">
        <div className="flex items-center gap-space-3 mb-space-2">
          <StatusDot />
          <h2 className="font-primary font-semibold text-size-h6 text-placeholder_3 uppercase">
            Frequently Asked
          </h2>
        </div>
        <h2 className="font-medium text-size-h3">
          Answers before your need to ask twice
        </h2>
      </div>
      <div className="space-y-space-4">
        <PolicyCard />
      </div>
    </div>
  );
};

export default page;
