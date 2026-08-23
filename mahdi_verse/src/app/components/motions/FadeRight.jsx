"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * FadeRight
 * -----------------------------------------------------------------------
 * FadeLeft-er ulta version — prothome opacity 0 + right e ektu sorano
 * thake, tarpor opacity 1 hoye nijer jaygay eshe bose. Multiple element
 * ke alada alada shomoy e animate korate `delay` prop use koro (stagger).
 *
 * USAGE
 * -----------------------------------------------------------------------
 * <FadeRight delay={0}>
 *   <Image src={heroImage} alt="hero" />
 * </FadeRight>
 *
 * FadeLeft (text left theke) + FadeRight (image right theke) — duita
 * ekshathe use korle Hero section-e text ebong image dui pash theke
 * eshe center e meet korar effect hoy.
 * -----------------------------------------------------------------------
 */
const FadeRight = ({
  children,
  delay = 0,
  duration = 0.6,
  distance = 40, // koto px right theke ashbe
  className = "",
  as = "div", // "h1", "p", "span" — jekono HTML tag hisebe render korate paro
  once = true, // true hole ekbar animate hoye thakbe, abar scroll korle repeat hobe na
}) => {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, x: distance }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

export default FadeRight;
