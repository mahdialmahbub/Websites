import React from "react";

const Input = ({
  icon = "fi fi-rs-home",
  label = "Label",
  placeholder = "Enter text...",
  className,
  type,
  value,
  onChange,
}) => {
  return (
    <div className={`${className} group`}>
      <label htmlFor="input" className="">
        <div className="flex items-center gap-1.5 text-placeholder">
          <i
            className={`${icon} text-[12px] flex items-center justify-center`}
          ></i>
          <p className="font-primary font-semibold text-lg">{label}</p>
        </div>

        <input
          type={type}
          placeholder={placeholder}
          className="w-full font-medium"
          onChange={onChange}
          value={value}
        />
      </label>
      <div className="h-0.75 w-full bg-placeholder/40 mx-3 mt-space-1">
        <div className="line h-full w-0 bg-primary-5 transition-all duration-300 group-hover:w-full group-focus-within:w-full"></div>
      </div>
    </div>
  );
};

export default Input;
