"use client";

import React from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

/**
 * FadeUp
 * -----------------------------------------------------------------------
 * Scroll kore element-er kache gele, niche theke upore fade kore uthe ashe.
 *
 * 1. Custom cubic-bezier ease ([0.16, 1, 0.3, 1], expo-out style) —
 *    generic "easeOut" er cheye onek beshi natural.
 * 2. Distance 28px, duration 0.7s — subtle movement, refined lage.
 * 3. viewport margin add kora hoyeche, tai element pura screen-e ashar
 *    age-i animation shuru hoy.
 * 4. `useReducedMotion` respect kora hoy — OS-e reduced motion on
 *    thakle shudhu fade hobe, movement thakbe na.
 * 5. `blur` ar `scale` — optional props, hero/heading-er jonno extra
 *    polish. Card grid-e onek item thakle off-e rakhben (blur GPU-heavy).
 * 6. `...rest` diye extra prop (id, onClick, style, aria-*) pass kora jay.
 *
 * NOTE: LazyMotion strict mode-e `motion` component use kora jay na,
 * tai ekhane `m` use kora hoyeche (bundle size-o chhoto thake).
 *
 * USAGE
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
          y: distance, // niche theke shuru, upore eshe bose
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
    </LazyMotion>
  );
};

export default FadeUp;