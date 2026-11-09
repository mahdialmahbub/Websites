// components/SmoothScrolling.jsx
"use client";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

function SmoothScrolling({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, syncTouch: true }}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;
