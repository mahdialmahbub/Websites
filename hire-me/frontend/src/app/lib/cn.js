import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Class merge helper: conflicting Tailwind class thakle shesh-er ta jite.
 * Custom font-size token (text-caption, text-small) ekhane na dile
 * tailwind-merge segulo ke "text color" bhebe vul class remove korbe.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["caption", "small"] }],
    },
  },
});

export const cn = (...inputs) => twMerge(clsx(inputs));