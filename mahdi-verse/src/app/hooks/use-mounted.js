import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,  // client snapshot
    () => false, // server snapshot (SSR + prothom hydration render)
  );
}