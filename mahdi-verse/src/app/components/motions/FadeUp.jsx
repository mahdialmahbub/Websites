"use client";

import { useEffect, useRef, useState } from "react";
import "./fade-up.css";

/**
 * FadeUp (CSS version)
 * -----------------------------------------------------------------------
 * Scroll kore element-er kache gele, niche theke upore fade kore uthe ashe.
 *
 * Animation puro ./fade-up.css e (custom expo-out cubic-bezier, subtle
 * 28px movement, reduced-motion support). Ei component shudhu element
 * view-e ashle data-visible="true" set kore (IntersectionObserver diye),
 * ar rootMargin "-10%" bottom e thakay element pura screen-e ashar age-i
 * animation shuru hoy.
 *
 * `blur` ar `scale` optional props hero/heading-er jonno extra polish.
 * Card grid-e onek item thakle off-e rakho (blur GPU-heavy, onek card
 * ekshathe blur korle scroll jerky lagte pare).
 *
 * `...rest` diye extra prop (id, onClick, aria-*) sorasori pass kora jay.
 *
 * USAGE — age-r moto e, kono breaking change nai:
 * -----------------------------------------------------------------------
 * <FadeUp delay={0}>
 *   <PropertyCard property={item} />
 * </FadeUp>
 *
 * Hero heading-e extra "wow" chaile:
 * -----------------------------------------------------------------------
 * <FadeUp as="h1" scale blur duration={0.9}>
 *   Amader Featured Properties
 * </FadeUp>
 * -----------------------------------------------------------------------
 */
const FadeUp = ({
  children,
  delay = 0, // seconds
  duration = 0.7, // seconds
  distance = 28, // koto px niche theke ashbe
  className = "",
  as: Tag = "div", // "h1", "p", "span" — jekono HTML tag
  once = true, // true hole ekbar animate hoye thakbe
  blur = false, // true dile subtle blur-to-sharp effect
  scale = false, // true dile 0.96 -> 1 subtle scale
  amount = 0.3, // element koto % view-e ashle trigger hobe (0 - 1)
  style,
  ...rest
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      // framer er margin: "0px 0px -10% 0px" er moto
      { threshold: amount, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, amount]);

  const classes = [
    "fade-up",
    scale && "fade-up--scale",
    blur && "fade-up--blur",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      className={classes}
      style={{
        "--fu-delay": `${delay}s`,
        "--fu-duration": `${duration}s`,
        "--fu-distance": `${distance}px`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default FadeUp;
