import React, { useState } from "react";

const DarkToggleBTN = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className="flex items-center justify-center p-space-1 rounded-md bg-primary-50 border border-primary-900/10 max-w-max">
      <div
        className={`w-[24px] h-[24px] rounded-sm ${!isDark && "bg-primary-500"} *:text-size-xs_2 flex items-center justify-center`}
      >
        <i
          className={`${!isDark ? "fi fi-sr-brightness text-primary-50" : "fi fi-rr-brightness text-primary-500"}`}
        ></i>
      </div>
      <div
        className={`w-[24px] h-[24px] rounded-sm ${isDark && "bg-primary-500"} *:text-size-xs_2 flex items-center justify-center`}
      >
        <i
          className={`${isDark ? "fi fi-sr-moon-stars text-primary-50" : "fi fi-rr-moon-stars text-primary-500"}`}
        ></i>
      </div>
    </div>
  );
};

export default DarkToggleBTN;
