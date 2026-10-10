export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFBFB]";

// Title font-size: 14px@375 → 16px@1440
export function Title({ children }) {
  return (
    <span className="inline-block text-[clamp(0.875rem,calc(0.831rem+0.188vw),1rem)] font-medium leading-5 text-neutral-900 font-primary text-nowrap">
      {children}
      <span className="mt-1 block h-0.5 w-7.5 rounded-full bg-purple-600" />
    </span>
  );
}
