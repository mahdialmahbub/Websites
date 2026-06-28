import React from "react";

const Button = ({
  property = "primary",
  text,
  type = "submit",
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-primary-6 text-background",
    secondary: "bg-primary-2 text-primary-9",
    text: "bg-transparent text-primary-6",
  };

  return (
    <button type={type}
      className={`
        block items-center gap-1
        font-primary font-bold text-md
        ${property !== "text" ? "px-space-4 py-space-3" : ""}
        ${variants[property]}
        ${className}
      `}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;