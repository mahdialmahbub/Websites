"use client";

import { useState } from "react";

/**
 * The moving strip of the testimonial marquee.
 *
 * - xl and above: pauses on hover (pure CSS, see the <style> block in Testimonial.jsx)
 * - below xl: pauses while the strip is pressed, resumes on release
 *
 * Kept as a tiny client component so the Testimonial section itself stays server-rendered.
 *
 * @param {{ className?: string, children: React.ReactNode }} props
 */
const MarqueeTrack = ({ className = "", children }) => {
  const [isPressed, setIsPressed] = useState(false);

  const press = () => setIsPressed(true);
  // pointercancel fires when the browser takes over the gesture (e.g. page scroll),
  // pointerleave covers a mouse press that is dragged off the strip.
  const release = () => setIsPressed(false);

  return (
    <div
      className={className}
      data-pressed={isPressed}
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
    >
      {children}
    </div>
  );
};

export default MarqueeTrack;
