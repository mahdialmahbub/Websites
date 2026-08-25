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
      "py-[8px] xl:py-[12px] px-[12px] xl:px-[16px] bg-linear-to-tr from-[#5A4BFF] to-[#8F6BFF] text-white shadow-[0_4px_14px_-4px_rgba(90,75,255,0.45)] hover:shadow-[0_8px_22px_-4px_rgba(90,75,255,0.6)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
    secondary:
      "py-[8px] xl:py-[12px] px-[12px] xl:px-[16px] text-black dark:text-white hover:text-secondary2 active:scale-[0.98]",
    text: "text-black/60 dark:text-white/60 hover:text-[#8F6BFF] flex group items-center justify-center",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        "rounded-sm md:rounded-lg font-bold transition-[transform,box-shadow,color,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 text-large md:text-h6 xl:text-[20px] gap-1.5 items-center justify-center group flex disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
        variants[variant],
        fullWidth ? "w-full" : "w-max",
        className,
      )}
    >
      {loading && (
        <svg
          className="size-[1em] shrink-0 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}

      <p className="text-nowrap group-hover:text-primary2">{text}</p>

      {!loading && variant === "text" && isIcon && (
        <div className="flex items-center justify-center">
          <i className="fi fi-br-arrow-small-right group-hover:translate-x-1 transition-transform duration-200 ease-out inline-flex items-center justify-center text-black/60 dark:text-white/60 group-hover:text-primary2 text-[19px] xl:text-[23px]"></i>
        </div>
      )}
    </button>
  );
};

export default Button;
