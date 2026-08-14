import React from "react";

const OverallDataCard = ({
  icon = "fi fi-rr-order-history",
  title = "Pending Orders",
  value = "50",
  isMessage = false,
  message = "Awaiting Confirmations",
  variant = "success",
  colorA = "#5EEAD4", // bright cyan/teal - বড় portion
  colorB = "#0B1233", // dark navy - ছোট portion (card bg এর কাছাকাছি)
  blendAt = "65%",    // colorA koto% jaiga dhore rakhbe, ei jaigay giye colorB e blend hobe
  duration = "5s",
}) => {
  const gradient = `conic-gradient(from 90deg, ${colorA} 0%, ${colorB} ${blendAt}, ${colorA} 100%)`;

  return (
    <div className="relative w-60 rounded-lg overflow-hidden">
      {/* soft outer glow - same gradient, blurred */}
      <div
        className="absolute -inset-2 rounded-lg blur-lg opacity-70 animate-spin -z-10 pointer-events-none"
        style={{ background: gradient, animationDuration: duration }}
      />

      {/* crisp rotating two-tone border ring */}
      <div className="relative rounded-lg p-[2px] overflow-hidden">
        <div
          className="absolute -inset-[50%] animate-spin"
          style={{ background: gradient, animationDuration: duration }}
        />

        {/* card body - center dhekhe rakhe, sudhu ring ta dekha jay */}
        <div className="relative rounded-[6px] bg-background overflow-hidden">
          <div className="absolute inset-0 bg-secondary/5 pointer-events-none" />

          <div className="relative p-space-4">
            <div className="flex items-center gap-space-2 mb-2.5">
              <div className="p-space-1 rounded-sm bg-secondary/5 size-7.5 *:text-secondary text-size-large flex items-center justify-center">
                <i className={icon}></i>
              </div>
              <h3 className="text-size-h6 font-semibold text-placeholder_3">
                {title}
              </h3>
            </div>

            <h2 className="font-primary font-semibold text-size-h3 text-[#CBD5F5] mb-space-1">
              {value}
            </h2>

            {isMessage && (
              <p
                className={`${
                  variant == "success"
                    ? "text-green"
                    : variant == "warning"
                    ? "text-[#FCE486]"
                    : "text-red"
                } font-semibold text-size-medium`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallDataCard;