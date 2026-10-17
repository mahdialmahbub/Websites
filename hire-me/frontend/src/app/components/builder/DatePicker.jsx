import React from "react";

const Header = ({ active = false, text }) => {
  return (
    <div
      className={`h-13 px-space-4 rounded-sm  flex items-center justify-center text-body font-medium  ${active ? "bg-violet-500 text-neutral-50 font-semibold" : "bg-violet-50 hover:bg-violet-100 text-violet-500 font-medium"}`}
    >
        {text || "October"}
    </div>
  );
};

const item = ({ active = false, text }) => {
  return (
    <div
      className={`h-13 px-space-4 rounded-sm  flex items-center justify-center text-body font-medium  ${active ? "bg-violet-500 text-neutral-50 font-semibold" : "bg-white hover:bg-violet-50 text-neutral-950 border border-neutral-100 font-medium"}`}
    >
        {text || "1"}
    </div>
  );
};

const DatePicker = ({}) => {
  return (
    <div className="space-y-2.5 rounded-md bg-white border border-violet-50 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.10)]">
      {/* header */}
      <div className=" flex gap-space-4">
        <Header/>
      </div>
      <hr className="h-0.5 rounded-full w-full bg-neutral-100" />
      <div>
        
      </div>
    </div>
  );
};

export default DatePicker;
