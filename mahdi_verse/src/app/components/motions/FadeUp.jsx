"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * FadeUp
 * -----------------------------------------------------------------------
 * FadeLeft/FadeRight-er moto e, kintu x-er bodole y animate kore —
 * prothome opacity 0 + niche ektu sorano thake, scroll kore element-er
 * kache gele opacity 1 hoye upore nijer jaygay eshe bose.
 *
 * Card grid / list-er moto onek element ekshathe dekhate eta best fit
 * (ekta ekta kore niche theke uthe ashar effect), jemon FeaturedProperty
 * section-er property card gulo.
 *
 * USAGE
 * -----------------------------------------------------------------------
 * <FadeUp delay={0}>
 *   <PropertyCard property={item} />
 * </FadeUp>
 *
 * Card grid e stagger korate map-er index onujayi delay dao:
 * -----------------------------------------------------------------------
 * {properties.map((item, i) => (
 *   <FadeUp key={item.id} delay={i * 0.1}>
 *     <PropertyCard property={item} />
 *   </FadeUp>
 * ))}
 * -----------------------------------------------------------------------
 */
const FadeUp = ({
  children,
  delay = 0,
  duration = 0.6,
  distance = 40, // koto px niche theke ashbe
  className = "",
  as = "div", // "h1", "p", "span" — jekono HTML tag hisebe render korate paro
  once = true, // true hole ekbar animate hoye thakbe, abar scroll korle repeat hobe na
}) => {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

export default FadeUp;
