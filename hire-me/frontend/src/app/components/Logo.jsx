import Image from "next/image";
import { twMerge } from "tailwind-merge";

const LOGO_SIZE = { width: 200, height: 46 };

const SOURCES = {
  text: "/textLogo.svg",
  textWhite: "/textLogoWhite.svg",
  icon: "/logo.svg",
};

export default function Logo({
  className = "",
  priority = false,
  variant,
  text = true,
  textWhite = false,
  alt = "Hire Me",
  ...props
}) {
  const resolved =
    variant ?? (textWhite ? "textWhite" : text ? "text" : "icon");

  return (
    <Image
      alt={alt}
      src={SOURCES[resolved]}
      width={LOGO_SIZE.width}
      height={LOGO_SIZE.height}
      priority={priority}
      {...props}
      className={twMerge("h-auto w-auto", className)}
    />
  );
}