import React from "react";

const FieldCardHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-space-4">
        <div className="p-space-2 items-center justify-center rounded-full">
          #1
        </div>
        <div className="flex items-center gap-space-2">
          <button className="size-[38px] rounded-full bg-primary-500/5 hover:bg-primary-500/10 text-primary-500 transition-all duration-150 group disabled:cursor-not-allowed disabled:bg-neutral-500/10 disabled:text-neutral-500/40">
            <i className="fi fi-rr-arrow-small-down group-hover:tranneutral-y-2 transition-all duration-150 text-[26px]"></i>
          </button>
          <button className="size-[38px] rounded-full bg-primary-500/5 hover:bg-primary-500/10 text-primary-500 transition-all duration-150 group disabled:cursor-not-allowed disabled:bg-neutral-500/10 disabled:text-neutral-500/40 rotate-180">
            <i className="fi fi-rr-arrow-small-down group-hover:tranneutral-y-2 transition-all duration-150 text-[26px]"></i>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center size-[44px] hover:bg-red-500/5 rounded-full transition-all duration-150 cursor-pointer group">
        <i className="fi fi-rr-trash text-red-500/70 group-hover:text-red-500 text-[24px]"></i>
      </div>
    </div>
  );
};

export default FieldCardHeader;
