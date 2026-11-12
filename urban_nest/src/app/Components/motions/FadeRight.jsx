"use client";

import React from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

/**
 * FadeUp
 * -----------------------------------------------------------------------
 * Prothome opacity 0 + niche ektu sorano thake, scroll kore element-er
 * kache gele opacity 1 hoye upore nijer jaygay eshe bose.
 *
 * Card grid / list-er moto onek element ekshathe dekhate eta best fit
 * (ekta ekta kore niche theke uthe ashar effect), jemon FeaturedProperty
 * section-er property card gulo.
 *
 * FadeDown-er shathe shob feature hubohu same (easing, blur, scale
 * option, reduced-motion support, rest spread) — tai puro animation
 * family (FadeUp / FadeDown / FadeLeft / FadeRight) ek rokom "feel" dey.
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
 * Card grid e stagger korate map-er index onujayi delay dao:
 * -----------------------------------------------------------------------
 * {properties.map((item, i) => (
 *   <FadeUp key={item.id} delay={i * 0.1}>
 *     <PropertyCard property={item} />
 *   </FadeUp>
 * ))}
 * -----------------------------------------------------------------------
 */
const EASE_SMOOTH = [0.16, 1, 0.3, 1]; // expo-out style — smooth, premium deceleration

const FadeUp = ({
  children,
  delay = 0,
  duration = 2,
  distance = 28, // koto px niche theke ashbe
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
          y: distance, // niche theke shuru
          ...(scale && { scale: 0.96 }),
          ...(blur && { filter: "blur(10px)" }),
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          ...(scale && { scale: 1 }),
          ...(blur && { filter: "blur(0px)" }),
        }}
        viewport={{ once, amount, margin: "0px 0px -5% 0px" }}
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
