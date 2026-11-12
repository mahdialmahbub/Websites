"use client";

import React from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

/**
 * FadeLeft
 * -----------------------------------------------------------------------
 * Prothome opacity 0 + left e ektu sorano thake, tarpor opacity 1 hoye
 * nijer jaygay eshe bose. Multiple element ke alada alada shomoy e
 * animate korate `delay` prop use koro (stagger effect).
 *
 * FadeDown-er shathe shob feature hubohu same (easing, blur, scale
 * option, reduced-motion support, rest spread) — tai puro animation
 * family (FadeUp / FadeDown / FadeLeft / FadeRight) ek rokom "feel" dey.
 *
 * NOTE: LazyMotion strict mode-e `motion` component use kora jay na,
 * tai ekhane `m` use kora hoyeche (bundle size-o chhoto thake).
 *
 * USAGE — Hero section e title -> subtitle -> button, ekta ekta kore ashbe
 * -----------------------------------------------------------------------
 * <FadeLeft delay={0}>
 *   <h1>Find Your Perfect Space</h1>
 * </FadeLeft>
 * <FadeLeft delay={0.15}>
 *   <p>Explore thousands of verified properties...</p>
 * </FadeLeft>
 * <FadeLeft delay={0.3}>
 *   <Button>View Properties</Button>
 * </FadeLeft>
 *
 * Scroll kore niche kono section e dile (Hero chara), oi section
 * viewport e ashar shomoy e animation trigger hobe automatically —
 * alada kono code lagbe na.
 * -----------------------------------------------------------------------
 */
const EASE_SMOOTH = [0.16, 1, 0.3, 1]; // expo-out style — smooth, premium deceleration

const FadeLeft = ({
  children,
  delay = 0,
  duration = 2,
  distance = 28, // koto px left theke ashbe
  className = "",
  as = "div", // "h1", "h2", "p", "span" — jekono HTML tag hisebe render korate paro
  once = true, // true hole ekbar animate hoye thakbe, abar scroll korle repeat hobe na
  blur = false, // true dile subtle blur-to-sharp effect (hero/heading-er jonno)
  scale = false, // true dile 0.96 -> 1 subtle scale, "settle into place" feel
  amount = 0.3, // element koto % view-e ashle trigger hobe
  ...rest
}) => {
  const MotionTag = m[as] || m.div;
  const shouldReduceMotion = useReducedMotion();

  // Accessibility: OS-e reduced motion on thakle movement bad diye
  // shudhu simple fade kori
  if (shouldReduceMotion) {
    return (
      <LazyMotion features={domAnimation} strict>
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
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionTag
        initial={{
          opacity: 0,
          x: -distance, // left theke shuru
          ...(scale && { scale: 0.96 }),
          ...(blur && { filter: "blur(10px)" }),
        }}
        whileInView={{
          opacity: 1,
          x: 0,
          ...(scale && { scale: 1 }),
          ...(blur && { filter: "blur(0px)" }),
        }}
        viewport={{ once, amount, margin: "0px -5% 0px 0px" }}
        transition={{ duration, delay, ease: EASE_SMOOTH }}
        className={className}
        {...rest}
      >
        {children}
      </MotionTag>
    </LazyMotion>
  );
};

export default FadeLeft;
