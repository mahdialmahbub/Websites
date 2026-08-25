"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * FadeRight
 * -----------------------------------------------------------------------
 * FadeLeft-er thik ulTo — bam dik theke dan dik e "hele ashe":
 * prothome opacity 0 + bam dike ektu sorano thake, scroll kore
 * element-er kache gele opacity 1 hoye dan dike (nijer jaygay) eshe
 * bose.
 *
 * "Image left, text right" layout-e image-ta FadeRight diye animate
 * korle mone hoy image-ta ese text-er dike settle korlo — FadeLeft
 * (text) ar FadeRight (image) ekshathe use korle dujon-i majhkhane
 * eshe milito hoy, nice symmetrical entrance toiri hoy.
 *
 * FadeUp/FadeDown/FadeLeft-er shathe shob feature hubohu same
 * (easing, blur, scale, reduced-motion support, rest spread).
 *
 * USAGE
 * -----------------------------------------------------------------------
 * <FadeRight>
 *   <img src="/property-hero.jpg" alt="Property" />
 * </FadeRight>
 *
 * Do-column layout-e opposite direction theke ashar effect:
 * -----------------------------------------------------------------------
 * <div className="grid grid-cols-2 gap-8">
 *   <FadeRight><img src="..." /></FadeRight>
 *   <FadeLeft><PropertyDetails /></FadeLeft>
 * </div>
 * -----------------------------------------------------------------------
 */
const EASE_SMOOTH = [0.16, 1, 0.3, 1]; // expo-out style — smooth, premium deceleration

const FadeRight = ({
  children,
  delay = 0,
  duration = 2,
  distance = 28, // koto px bam dik theke ashbe
  className = "",
  as = "div", // "h1", "p", "span" — jekono HTML tag hisebe render korate paro
  once = true, // true hole ekbar animate hoye thakbe, abar scroll korle repeat hobe na
  blur = false, // true dile subtle blur-to-sharp effect
  scale = false, // true dile 0.96 -> 1 subtle scale, "settle into place" feel
  amount = 0.3, // element koto % view-e ashle trigger hobe
  ...rest
}) => {
  const MotionTag = motion[as] || motion.div;
  const shouldReduceMotion = useReducedMotion();

  // Accessibility: OS-e reduced motion on thakle movement bad diye
  // shudhu simple fade kori
  if (shouldReduceMotion) {
    return (
      <MotionTag
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once, amount }}
        transition={{ duration: 0.4, delay }}
        className={className}
        {...rest}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      initial={{
        opacity: 0,
        x: -distance, // bam dik theke shuru, dan dike eshe bose
        ...(scale && { scale: 0.96 }),
        ...(blur && { filter: "blur(10px)" }),
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        ...(scale && { scale: 1 }),
        ...(blur && { filter: "blur(0px)" }),
      }}
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
      transition={{ duration, delay, ease: EASE_SMOOTH }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default FadeRight;
