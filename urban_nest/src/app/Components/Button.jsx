"use client";

import React, { useRef } from "react";

const Button = ({
  property = "primary",
  text,
  type = "submit",
  className = "",
  ...props
}) => {
  const buttonRef = useRef(null);
  const glowRef = useRef(null);

  const variants = {
    primary: "bg-primary-6 text-background",
    secondary: "bg-primary-1 hover:bg-primary-2 text-primary-9",
  };

  const handleMouseMove = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    glowRef.current.style.left = `${x}px`;
    glowRef.current.style.top = `${y}px`;
  };

  const handleMouseLeave = () => {
    glowRef.current.style.left = "50%";
    glowRef.current.style.top = "50%";
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden
        block items-center gap-1
        font-primary font-bold text-[16px] leading-5.5 text-center btn
        px-space-4 py-space-3 cursor-pointer transition-colors duration-150
        ${variants[property]}
        ${className}
      `}
      {...props}
    >
      {/* Glow */}
      <span ref={glowRef} className="btn-glow"></span>

      {/* Text */}
      <span className="relative z-10">{text}</span>
    </button>
  );
};

export default Button;