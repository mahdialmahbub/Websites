import React from "react";

const SavedAddress = ({ address }) => {
  return (
    <div className="flex gap-space-4 p-space-3 rounded-lg bg-secondary/5 border border-secondary/30">
      <div className="size-7 rounded-full bg-secondary/10 flex items-center justify-center">
        <i className="fi fi-sr-land-layer-location text-size-large text-secondary"></i>
      </div>
      <p className="font-primary text-size-h6 font-medium text-[#CBD5F5]">
        {address}
      </p>
    </div>
  );
};

export default SavedAddress;
