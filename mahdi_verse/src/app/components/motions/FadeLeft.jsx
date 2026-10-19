"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * FadeLeft
 * -----------------------------------------------------------------------
 * FadeUp/FadeDown-er moto e, kintu y-er bodole x animate kore — dan
 * dik theke bam dik e "hele ashe": prothome opacity 0 + dan dike ektu
 * sorano thake, scroll kore element-er kache gele opacity 1 hoye bam
 * dike (nijer jaygay) eshe bose.
 *
 * Text block jekhane paser kono element-er (image/media) shathe
 * horizontal-e pair kora thake, sekhane best fit — jemon "image left,
 * text right" layout-e text-ta FadeLeft diye animate korle mone hoy
 * text-ta ese image-er dike settle korlo.
 *
 * FadeUp/FadeDown-er shathe shob feature hubohu same (easing, blur,
 * scale, reduced-motion support, rest spread) — puro family (FadeUp /
 * FadeDown / FadeLeft / FadeRight) ek rokom "feel" dey.
 *
 * USAGE
 * -----------------------------------------------------------------------
 * <FadeLeft>
 *   <p>Property-r description ekhane thakbe...</p>
 * </FadeLeft>
 *
 * Do-column layout-e opposite direction theke ashar effect (FadeRight
 * er sathe combo, dutoi majhkhane eshe milito hoy):
 * -----------------------------------------------------------------------
 * <div className="grid grid-cols-2 gap-8">
 *   <FadeRight><img src="..." /></FadeRight>
 *   <FadeLeft><PropertyDetails /></FadeLeft>
 * </div>
 * -----------------------------------------------------------------------
 */
const EASE_SMOOTH = [0.16, 1, 0.3, 1]; // expo-out style — smooth, premium deceleration

const FadeLeft = ({
  children,
  delay = 0,
  duration = 0.7,
  distance = 28, // koto px dan dik theke ashbe
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
        x: distance, // dan dik theke shuru, bam dike eshe bose
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

export default FadeLeft;
