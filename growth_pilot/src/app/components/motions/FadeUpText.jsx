"use client";

import { Children, isValidElement } from "react";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

// Splits either a plain string or JSX children (strings mixed with elements,
// e.g. a highlighted <span>) into an ordered array of animatable "words".
// A nested element is kept whole as a single unit instead of being torn apart.
const splitToWords = (content) => {
  const units = [];
  Children.forEach(content, (child) => {
    if (typeof child === "string") {
      child
        .split(" ")
        .filter((word) => word.length > 0)
        .forEach((word) => units.push(word));
    } else if (isValidElement(child)) {
      units.push(child);
    }
  });
  return units;
};

const FadeUpText = ({ text, children, delay = 0, className = "" }) => {
  const words = splitToWords(text ?? children);

  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: delay + index * 0.15,
          }}
          className="mr-3 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export default FadeUpText;
