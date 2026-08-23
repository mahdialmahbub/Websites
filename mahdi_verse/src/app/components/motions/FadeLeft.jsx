"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * FadeLeft
 * -----------------------------------------------------------------------
 * Prothome opacity 0 + left e ektu sorano thake, tarpor opacity 1 hoye
 * nijer jaygay eshe bose. Multiple element ke alada alada shomoy e
 * animate korate `delay` prop use koro (stagger effect).
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
const FadeLeft = ({
  children,
  delay = 0,
  duration = 0.6,
  distance = 40, // koto px left theke ashbe
  className = "",
  as = "div", // "h1", "p", "span" — jekono HTML tag hisebe render korate paro
  once = true, // true hole ekbar animate hoye thakbe, abar scroll korle repeat hobe na
}) => {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, x: -distance }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

export default FadeLeft;
