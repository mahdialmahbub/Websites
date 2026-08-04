import React from "react";

const Button = ({
  className,
  variant = "primary",
  size,
  fullWidth,
  type = "button",
  isLoading = false,
  icon = "fi fi-rr-arrow-small-right",
  leftIcon = false,
  rightIcon = false,
  disabled,
  text,
  ...props
}) => {
  return variant == "primary" ? (
    <button
      className={`${className} p-3.5 text-primary-50 font-bold flex items-center justify-center gap-1.5 shadow-[1_1px_3px_rgba(86, 79, 197, 0.9),-1_-1px_2px_rgba((130, 119, 255, 0.90)),1_-1px_2px_rgba(86, 79, 197, 0.2),-1_1px_2px_rgba(86, 79, 197, 0.2),inset_-1_-1px_2px_rgba(86, 79, 197, 0.5),inset_1_1px_2px_rgba(130, 119, 255, 0.30)] bg-linear-to-br from-[#7168FF] to-[#675EED] hover:shadow-[1_1px_3px_rgba(65, 59, 147, 0.9),-1_-1px_2px_rgba((151, 139, 255, 0.90)),1_-1px_2px_rgba(65, 59, 147, 0.2),-1_1px_2px_rgba(65, 59, 147, 0.2),inset_-1_-1px_2px_rgba(65, 59, 147, 0.5),inset_1_1px_2px_rgba(151, 139, 255, 0.30)] hover:bg-linear-to-br hover:from-[#675EEA] hover:to-[#7168FF] active:bg-primary-500 active:shadow-[1_1px_2px_rgba(130, 119, 255), 0.3),-1_-1px_2px_rgba((86, 79, 197, 0.50)),inset_1_-1px_2px_rgba(86, 79, 197, 0.2),inset_-1_1px_2px_rgba(86, 79, 197, 0.2),inset_-1_-1px_2px_rgba(86, 79, 197, 0.9),inset_1_1px_3px_rgba(86, 79, 197, 0.90)] rounded-lg ${fullWidth && "w-full"} ${disabled && "opacity-50 cursor-not-allowed"}`}
      type={type}
      {...props}
    >
      {icon && leftIcon && <i className={`text-size-md ${icon} `}></i>}
      <h4 className="font-bold font-primary text-size-sm">{text}</h4>
      {icon && rightIcon && <i className={`text-size-md ${icon} `}></i>}
    </button>
  ) : (
    <button className="flex items-center justify-center gap-space-1 text-primary-900 hover:text-primary-500">
      {icon && leftIcon && <i className={`text-size-md ${icon} `}></i>}
      <h4 className="font-semibold font-primary text-size-sm">{text}</h4>
      {icon && rightIcon && <i className={`text-size-md ${icon} `}></i>}
    </button>
  );
};

export default Button;
