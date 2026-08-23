import clsx from "clsx";

const Button = ({
  text = 'Text',
  variant = "primary",
  type = "submit",
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  onClick,
}) => {

  const variants = {
    primary:
      "py-[8px] xl:py-[12px] px-[12px] xl:px-[16px] bg-linear-to-tr from-[#5A4BFF] to-[#8F6BFF] text-white active:scale-98 hover:shadow-[0_0_10px] hover:shadow-primary",
    secondary:
      "py-[8px] xl:py-[12px] px-[12px] xl:px-[16px] text-black hover:bg-linear-to-tr from-[#5A4BFF] to-[#8F6BFF]",
    text:
      "text-black/60 dark:text-white/60 hover:text-[#8F6BFF] flex group item-center justify-center",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        "rounded-sm md:rounded-lg font-bold transition-all duration-200 focus:outline-none text-large md:text-h6 xl:text-[20px] gap-[4px] item-center justify-center group flex",
        variants[variant],
        fullWidth ? "w-full" : "w-max",
        (disabled || loading) && "opacity-60 cursor-not-allowed ",
        className,
      )}
    > 
      <p className="text-nowrap">{text}</p>

      <div className="flex items-center justify-center">
        {variant === "text" && (
          <i className="fi fi-br-arrow-small-right group-hover:translate-x-1 inline-flex items-center justify-center text-black/60 dark:text-white/60 group-hover:text-primary2 text-[19px] xl:text-[23px]"></i>
        )}
      </div>
    </button>
  );
};

export default Button;
