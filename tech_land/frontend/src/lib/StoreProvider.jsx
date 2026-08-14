"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

/**
 * Wrap your root layout's children with this once:
 *
 *   // app/layout.js
 *   import StoreProvider from "@/lib/StoreProvider";
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="en">
 *         <body>
 *           <StoreProvider>{children}</StoreProvider>
 *         </body>
 *       </html>
 *     );
 *   }
 */
export default function StoreProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
