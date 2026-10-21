"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * FadeUp
 * -----------------------------------------------------------------------
 * Scroll kore element-er kache gele, niche theke upore fade kore uthe ashe.
 * Ei version-ta age-r cheye onek smooth o "designed" lage:
 *
 * 1. Custom cubic-bezier ease ([0.16, 1, 0.3, 1], expo-out style) —
 *    generic "easeOut" er cheye onek beshi natural: prothome fast shuru
 *    hoy, tarpor khub smooth-ly slow hoye thame, hothat "snap" kore
 *    theme jay na.
 * 2. Distance kome geche (40px -> 28px), duration ektu beshi (0.6s -> 0.7s)
 *    — boro jump na diye chhoto/subtle movement dile refined-professional
 *    lage, "flashy" lage na.
 * 3. viewport margin add kora hoyeche, tai element pura screen-e ashar
 *    age-i animation shuru hoy — scroll-er shathe timing-ta natural
 *    lage, "pop" kore ashe na.
 * 4. `useReducedMotion` respect kora hoy — user-er OS-e reduced motion
 *    on thakle shudhu fade hobe, movement thakbe na. Accessibility +
 *    professional touch, client/agency audit-e valo dekhay.
 * 5. `blur` ar `scale` — notun optional props, hero/heading-er jonno
 *    extra polish. Card grid-e onek item thakle off-e rakhben (blur
 *    GPU-heavy, onek card ekshathe blur korle scroll jerky lagte pare).
 * 6. `...rest` diye extra prop (id, onClick, style, aria-*) o sorasori
 *    pass kora jay — component-ta age-r cheye reusable holo.
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
const EASE_SMOOTH = [0.16, 1, 0.3, 1]; // expo-out style — smooth, premium deceleration

const FadeUp = ({
  children,
  delay = 0,
  duration = 0.7,
  distance = 28, // koto px niche theke ashbe
  className = "",
  as = "div", // "h1", "p", "span" — jekono HTML tag hisebe render korate paro
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
        y: distance,
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

export default FadeUp;