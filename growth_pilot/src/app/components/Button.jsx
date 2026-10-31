import clsx from "clsx";

const Button = ({
  text = "Text",
  variant = "primary",
  type = "submit",
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  onClick,
  isIcon = true,
}) => {
  const variants = {
    primary:
      "px-[clamp(1.25rem,1.1591rem_+_0.4545vw,1.5rem)] bg-linear-to-tr from-[#5A4BFF] to-[#8F6BFF] text-white shadow-[0_4px_14px_-4px_rgba(90,75,255,0.45)] hover:shadow-[0_8px_22px_-4px_rgba(90,75,255,0.6)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
    secondary:
      "px-[clamp(1.25rem,1.1591rem_+_0.4545vw,1.5rem)] text-[#5A4BFF] hover:bg-[#5A4BFF]/10 hover:border-[#5A4BFF]/10 active:scale-[0.98] bg-[#5A4BFF]/5 border border-[#5A4BFF]/5",
    text: "text-black/60 dark:text-white/60 flex group items-center justify-center hover:text-[#5A4BFF]",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        "rounded-sm md:rounded-lg font-semibold transition-[transform,box-shadow,color,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 text-large md:text-h6 xl:text-[20px] gap-1.5 items-center justify-center group flex disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none h-[clamp(2.5rem,2.3182rem+0.9091vw,3rem)]",
        variants[variant],
        fullWidth ? "w-full" : "w-max",
        className,
      )}
    >
      {loading && <i className="fi fi-rr-loading text-[1em] animate-spin"></i>}

      <p
        className={`text-nowrap cursor-pointer text-[clamp(0.875rem,0.7841rem+0.4545vw,1.125rem)] ${variant == "text" && "hover:text-primary2"} transition-[transform,box-shadow,color,opacity] duration-200 ease-out `}
      >
        {text}
      </p>

      {!loading && variant === "text" && isIcon && (
        <div className="flex items-center justify-center">
          <i className="fi fi-br-arrow-small-right group-hover:translate-x-1 transition-transform duration-200 ease-out inline-flex items-center justify-center text-black/60 dark:text-white/60 group-hover:text-primary2 text-[19px] xl:text-[23px]"></i>
        </div>
      )}
    </button>
  );
};

export default Button;
