const STEPS = [
  "Right-Click",
  "Inspect",
  "Ctrl + Shift + P",
  "Search for “javascript”",
  "Select Enable JavaScript",
  "Refresh this page to continue.",
];

export default function NoScriptNotice() {
  return (
    <noscript>
      <div
        role="alert"
        className="w-full border-l-4 border-orange-500 bg-[#FBF0E6] px-[clamp(1rem,calc(1.818vw+0.636rem),2rem)] py-3 flex gap-3"
      >
        <i class="fi fi-rr-triangle-warning text-[20px] text-orange-800"></i>
        <p className="text-[clamp(0.75rem,calc(0.364vw+0.682rem),1rem)] font-medium text-orange-800 font-primary">
          JavaScript is off in your browser. The editor needs it to build and
          save your resume — turn it on to continue.
        </p>
      </div>
    </noscript>
  );
}
