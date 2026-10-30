import { twMerge } from "tailwind-merge";

// width/height ekhane shudu aspect ratio er hint (page load e layout shift atkate).
// Asol size CSS (className) diye hoy, tai `h-auto w-auto` diye natural size ba
// className er size ney.
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
    // Next SVG optimize kore na (automatic unoptimized), tai next/image e kono
    // laabh nai; ulta width/height modify warning ashe. Plain <img> e oi warning nai.
    // `priority` er jaygay loading="eager" + fetchPriority="high".
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      src={SOURCES[resolved]}
      width={LOGO_SIZE.width}
      height={LOGO_SIZE.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      {...props}
      // object-contain: flex parent image ke stretch korleo logo distort hoy na.
      className={twMerge("h-auto w-auto object-contain", className)}
    />
  );
}
