// FadeLeft.js
const FadeLeft = ({
  children,
  delay = 0,
  duration = 0.6,
  distance = 40,
  className = "",
  as: Tag = "div",
  trigger = "scroll", // "scroll" | "load"
}) => (
  <Tag
    className={["fade-left", trigger === "load" && "fade-on-load", className]
      .filter(Boolean)
      .join(" ")}
    style={{
      "--fade-delay": delay,
      "--fade-duration": `${duration}s`,
      "--fade-distance": `${distance}px`,
    }}
  >
    {children}
  </Tag>
);

export default FadeLeft;