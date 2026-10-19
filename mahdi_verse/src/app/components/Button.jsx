import React from "react";


const Button = ({
  className = "",
  varient = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  isLoading = false,
  icon = "fi fi-rr-arrow-small-right",
  leftIcon = false,
  rightIcon = false,
  disabled = false,
  text,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const content = (
    <>
      {isLoading ? (
        <span
          aria-hidden="true"
          className="size-[16px] border-2 border-current border-t-transparent rounded-full animate-spin"
        />
      ) : (
        icon &&
        leftIcon && (
          <i aria-hidden="true" className={`text-size-md ${icon}`}></i>
        )
      )}
      <span className="font-primary text-size-base ">{text}</span>
      {!isLoading && icon && rightIcon && (
        <i aria-hidden="true" className={`text-size-md group-hover:translate-x-1.5 transition-all duration-200 ${icon}`}></i>
      )}
    </>
  );

  const baseClasses = `cursor-pointer select-none inline-flex items-center justify-center gap-[6px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 px-[24px] py-[16px] max-h-[48px] group ${
    fullWidth ? "w-full" : ""
  } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${
    isLoading ? "cursor-wait" : ""
  }`;

  if (varient === "secondary") {
    return (
      <button
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={`${baseClasses} rounded-lg font-semibold border-2 border-primary-500/10 bg-primary-500/5 text-primary-500 hover:bg-primary-500/10 active:bg-primary-500/15 active:scale-[0.98] ${className}`}
        {...props}
      >
        {content}
      </button>
    );
  }

  if (varient === "text") {
    return (
      <button
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={`${baseClasses} font-semibold text-primary-900 dark:text-foreground hover:text-primary-500 ${className}`}
        {...props}
      >
        {content}
      </button>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`${baseClasses} rounded-lg font-bold text-primary-50 bg-linear-to-br from-[#7168FF] to-[#675EED] shadow-[0_8px_20px_-6px_rgba(86,79,197,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] hover:from-[#675EEA] hover:to-[#7168FF] hover:shadow-[0_10px_24px_-6px_rgba(86,79,197,0.6),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-[0_4px_12px_-4px_rgba(86,79,197,0.5),inset_0_1px_2px_rgba(0,0,0,0.15)] active:scale-[0.98] ${className}`}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
