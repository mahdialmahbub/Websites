"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1]; // expo-out, FadeUp family-r moto same feel

/**
 * Hero-r shob timing ek jaygay (seconds).
 * Speed pochhondo na hole shudhu ekhane change koro.
 */
const TIMELINE = {
  avatar: 0,
  icons: 0.45, // avatar prai shesh hole icon beriye ashbe
  iconStagger: 0.07, // protita icon-er majhe gap
  badge: 0.95,
  title: 1.05,
  subtitle: 1.17,
  cta: 1.29,
  stats: 1.41,
};

/**
 * @typedef {Object} HeroAvatarProps
 * @property {import("react").ReactNode} children - Profile image
 * @property {string} [className] - Extra Tailwind class
 */

/**
 * Circle image: opacity 0 + choto theke full size e ashe.
 * z-10 dewa ache jate icon gulo image-er pichon theke berote pare.
 * @param {HeroAvatarProps} props
 */
export const HeroAvatar = ({ children, className = "" }) => {
  const reduce = useReducedMotion();
  const delay = TIMELINE.avatar;

  return (
    <motion.div
      initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        scale: { duration: 0.9, delay, ease: EASE },
        opacity: { duration: 0.6, delay, ease: "easeOut" },
      }}
      className={`relative z-10 ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * @typedef {Object} HeroOrbitIconProps
 * @property {import("react").ReactNode} children - Icon image
 * @property {number} x - Image-er center theke final X offset (px). Negative = bam dike
 * @property {number} y - Image-er center theke final Y offset (px). Negative = upore
 * @property {number} [index=0] - Stagger order (0 = prothom icon)
 * @property {string} [className] - Extra Tailwind class
 */

/**
 * Tech icon circle: image-er center theke shuru hoye (x, y) te giye bose.
 * Position `left-1/2 top-1/2` diye center e anchor kora, shudhu transform
 * animate hoy (GPU-friendly, layout shift nai).
 * @param {HeroOrbitIconProps} props
 */
export const HeroOrbitIcon = ({ children, x, y, index = 0, className = "" }) => {
  const reduce = useReducedMotion();
  const delay = TIMELINE.icons + index * TIMELINE.iconStagger;

  return (
    <motion.div
      initial={
        reduce
          ? { opacity: 0, x, y }
          : { opacity: 0, x: 0, y: 0, scale: 0.3 }
      }
      animate={{ opacity: 1, x, y, scale: 1 }}
      transition={{
        x: { duration: 0.8, delay, ease: EASE },
        y: { duration: 0.8, delay, ease: EASE },
        scale: { duration: 0.8, delay, ease: EASE },
        opacity: { duration: 0.25, delay, ease: "easeOut" },
      }}
      className={`absolute left-1/2 top-1/2 z-0 -ml-6.5 -mt-6.5 flex size-13 items-center justify-center rounded-full heroIcon bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * @typedef {Object} HeroItemProps
 * @property {import("react").ReactNode} children
 * @property {"badge" | "title" | "subtitle" | "cta" | "stats"} [stage="title"] - Timeline-er kon dhape ashbe
 * @property {"div" | "h1" | "h2" | "p" | "span"} [as="div"] - Kon HTML tag e render hobe
 * @property {number} [distance=20] - Koto px niche theke uthbe
 * @property {string} [className] - Extra Tailwind class
 */

/**
 * Title / subtitle / CTA / badge: ektu niche theke fade kore uthe ashe.
 * @param {HeroItemProps} props
 */
export const HeroItem = ({
  children,
  stage = "title",
  as = "div",
  distance = 20,
  className = "",
  ...rest
}) => {
  const MotionTag = motion[as] || motion.div;
  const reduce = useReducedMotion();

  return (
    <MotionTag
      initial={{ opacity: 0, y: reduce ? 0 : distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0.4 : 0.7,
        delay: TIMELINE[stage],
        ease: EASE,
      }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};