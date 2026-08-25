"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal
 * -----------------------------------------------------------------------
 * Family-r shob theke "premium" member — shudhu fade na, blur + scale
 * + ekta subtle lift, tinta effect ekshathe layer kore. Element
 * prothome ektu chhoto, blur, ar niche thake (opacity 0), scroll kore
 * kache gele dheere dheere sharp, full-size, ar nijer jaygay hoye
 * "shamne" eshe dandhay — mone hoy element-ta camera-r focus-e
 * ashche, lens-e dheere dheere clarity ashar moto feel.
 *
 * Hero heading, feature image, ba CTA-r moto "ekbar-i dekhbe, mone
 * rakhbe" type element-e best fit. Card grid-e onek item ekshathe
 * thakle FadeUp use koro — blur filter GPU-heavy, onek element
 * ekshathe blur korle scroll jerky lagte pare.
 *
 * FadeUp/Down/Left/Right-er shathe core convention same (easing,
 * reduced-motion support, rest spread, scroll-viewport trigger) —
 * shudhu ekhane "distance" onek kom (16px, direction family-r 28px
 * er tulonay), karon blur+scale nijeই onek movement-er feel dey —
 * beshi lift dile "over-animated" lagte pare.
 *
 * USAGE
 * -----------------------------------------------------------------------
 * <Reveal>
 *   <h1>Amader Featured Properties</h1>
 * </Reveal>
 *
 * Hero section-e heading + subtext + CTA — stagger kore reveal:
 * -----------------------------------------------------------------------
 * <Reveal as="h1">Find Your Dream Home</Reveal>
 * <Reveal as="p" delay={0.15}>Dhaka-r best location-e...</Reveal>
 * <Reveal delay={0.3}><CTAButton /></Reveal>
 *
 * Blur/scale intensity nijer moto adjust korte chaile:
 * -----------------------------------------------------------------------
 * <Reveal scaleFrom={0.85} blurAmount={20} duration={1.1}>
 *   <img src="/hero.jpg" alt="Hero" />
 * </Reveal>
 * -----------------------------------------------------------------------
 */
const EASE_SMOOTH = [0.16, 1, 0.3, 1]; // expo-out style — smooth, premium deceleration

const Reveal = ({
  children,
  delay = 0,
  duration = 0.9, // direction family-r cheye ektu beshi — blur+scale settle hote somoy lage
  distance = 16, // koto px niche theke ashbe (subtle rakha hoyeche, blur+scale-i main effect)
  scaleFrom = 0.92, // koto choto scale theke shuru hobe (1 = kono scale na)
  blurAmount = 14, // koto px blur diye shuru hobe (0 dile blur off thakbe)
  className = "",
  as = "div", // "h1", "h2", "p", "span" — jekono HTML tag hisebe render korate paro
  once = true, // true hole ekbar animate hoye thakbe, abar scroll korle repeat hobe na
  amount = 0.3, // element koto % view-e ashle trigger hobe
  ...rest
}) => {
  const MotionTag = motion[as] || motion.div;
  const shouldReduceMotion = useReducedMotion();

  // Accessibility: OS-e reduced motion on thakle movement/blur/scale
  // shob bad diye shudhu simple fade kori
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
        y: distance,
        scale: scaleFrom,
        filter: `blur(${blurAmount}px)`,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
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

export default Reveal;
