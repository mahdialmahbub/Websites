"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * SmoothScrollProvider
 * -----------------------------------------------------------------------
 * Pura website-e Lenis diye smooth/inertia scroll enable kore — mouse
 * wheel ba trackpad-e scroll korle native jerky scroll-er bodole
 * momentum soho smooth animate hoye scroll hobe.
 *
 * USAGE — root layout.jsx e shob content-ke wrap kore dao
 * -----------------------------------------------------------------------
 * import SmoothScrollProvider from "./components/SmoothScrollProvider";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <SmoothScrollProvider>{children}</SmoothScrollProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * -----------------------------------------------------------------------
 */
const SmoothScrollProvider = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // ekta scroll action shesh hote koto second lagbe
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth deceleration curve
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Onno kono jaygay theke (jemon FindProperty.jsx-er scrollIntoView)
    // Lenis instance access korte lagle window e rekhe dilam
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return children;
};

export default SmoothScrollProvider;
