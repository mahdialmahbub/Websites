import React from "react";

const DeviceCard = ({
  device = 'mobile',
  model = 'Mobile',
  location = 'House 12, Road 5, Kafrul, Mirpur, Dhaka 1212, Bangladesh.',
  isCurrent = false,
  onLogout = () => {},
}) => {
  const deviceIconClass =
    device === "mobile"
      ? "fi fi-rr-mobile-button"
      : device === "windows"
        ? "fi fi-rr-computer"
        : "fi fi-rr-tablet-android";

  return (
    <div className="h-18.75 w-full rounded-xl bg-background border border-secondary/20 p-space-6 flex items-center justify-between">
      {/* device icon, model and location */}
      <div className="flex items-center gap-space-4">
        <i className={`${deviceIconClass} text-[27px] text-secondary`}></i>
        <div>
          <h3 className="text-size-h6 font-semibold">{model}</h3>
          <p className="font-semibold text-size-large text-placeholder_2">
            {location}
          </p>
        </div>
      </div>

      {/* status: current device or logout action */}
      {isCurrent ? (
        <h4 className="font-primary text-size-h6 text-green font-medium">
          Current Device
        </h4>
      ) : (
        <button
          type="button"
          onClick={() => onLogout(device)}
          aria-label="Log out this device"
          className="size-9.5 flex items-center justify-center bg-red/5 border border-red/10 rounded-lg text-red text-size-h5 hover:bg-red/10 transition-colors cursor-pointer"
        >
          <i className="fi fi-rr-user-logout"></i>
        </button>
      )}
    </div>
  );
};

export default DeviceCard;