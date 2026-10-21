// components/SmoothScrolling.jsx
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

function SmoothScrolling({ children }) {
  return (
    <ReactLenis
      root={false}
      className="h-full overflow-hidden min-w-full"
      options={{ lerp: 0.1, duration: 1.2 }}
    >
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;