"use client";

import { useEffect, useRef, useState } from "react";
import "./fade-right.css";

/**
 * FadeRight (CSS version)
 * -----------------------------------------------------------------------
 * FadeLeft-er thik ulTo — bam dik theke dan dik e "hele ashe":
 * prothome opacity 0 + bam dike ektu sorano thake, scroll kore
 * element-er kache gele opacity 1 hoye nijer jaygay eshe bose.
 *
 * Animation puro ./fade-right.css e. Ei component shudhu element view-e
 * ashle data-visible="true" set kore (IntersectionObserver diye).
 *
 * USAGE
 * -----------------------------------------------------------------------
 * <FadeRight>
 *   <img src="/property-hero.jpg" alt="Property" />
 * </FadeRight>
 *
 * <div className="grid grid-cols-2 gap-8">
 *   <FadeRight><img src="..." /></FadeRight>
 *   <FadeLeft><PropertyDetails /></FadeLeft>
 * </div>
 * -----------------------------------------------------------------------
 */
const FadeRight = ({
  children,
  delay = 0, // seconds
  duration = 0.7, // seconds
  distance = 28, // koto px bam dik theke ashbe
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
    "fade-right",
    scale && "fade-right--scale",
    blur && "fade-right--blur",
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
        "--fr-delay": `${delay}s`,
        "--fr-duration": `${duration}s`,
        "--fr-distance": `${distance}px`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default FadeRight;
