"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * FadeDown
 * -----------------------------------------------------------------------
 * FadeUp-er thik ulTo direction — x-er bodole eita-o y-e animate kore,
 * kintu upore theke niche namar effect: prothome opacity 0 + upore
 * ektu sorano thake, scroll kore element-er kache gele opacity 1 hoye
 * niche nijer jaygay eshe bose.
 *
 * Heading/title-er jonno best fit — card grid-er thik upore section
 * heading ba hero title-e lagale mone hoy heading-ta "upor theke nemey
 * ashche". Niche-r card gulo FadeUp diye animate korle ekta "meet in
 * the middle" visual rhythm toiri hoy — heading upor theke, card niche
 * theke, dujon eshe ek jaygay milito hoy. Portfolio/landing page-e eta
 * khub polished dekhay.
 *
 * FadeUp-er shathe shob feature hubohu same rakha hoyeche (easing,
 * blur, scale option, reduced-motion support, rest spread) — tai puro
 * animation family (FadeUp / FadeDown / FadeLeft / FadeRight) ek
 * rokom "feel" dey, alada alada lage na.
 *
 * USAGE
 * -----------------------------------------------------------------------
 * <FadeDown>
 *   <h2>Featured Properties</h2>
 * </FadeDown>
 *
 * Heading FadeDown, niche-r card gulo FadeUp — classic combo:
 * -----------------------------------------------------------------------
 * <FadeDown as="h2" className="text-3xl font-semibold">
 *   Amader Featured Properties
 * </FadeDown>
 *
 * {properties.map((item, i) => (
 *   <FadeUp key={item.id} delay={i * 0.1}>
 *     <PropertyCard property={item} />
 *   </FadeUp>
 * ))}
 * -----------------------------------------------------------------------
 */
const EASE_SMOOTH = [0.16, 1, 0.3, 1]; // expo-out style — smooth, premium deceleration

const FadeDown = ({
  children,
  delay = 0,
  duration = 2,
  distance = 28, // koto px upor theke ashbe
  className = "",
  as = "div", // "h1", "h2", "p", "span" — jekono HTML tag hisebe render korate paro
  once = true, // true hole ekbar animate hoye thakbe, abar scroll korle repeat hobe na
  blur = false, // true dile subtle blur-to-sharp effect (hero/heading-er jonno)
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
        y: -distance, // FadeUp-er ulTo — niche theke na, upore theke shuru
        ...(scale && { scale: 0.96 }),
        ...(blur && { filter: "blur(10px)" }),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
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

export default FadeDown;
