"use client";

import { useEffect, useRef, useState } from "react";

export default function LazyVideo({
  mp4,
  poster,
  label = "Product demo video",
  width = 1280,
  height = 720,
  className = "",
}) {
  const ref = useRef(null);
  const [src, setSrc] = useState(null); // screen er kache ashle set hobe
  const [visible, setVisible] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [manual, setManual] = useState(false); // reduced motion / data saver

  // 1) Observer setup + kon file load hobe sheta thik kora
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;

    // (isMobile, chosen lines muchhe din, shorashori mp4 bebohar korun)

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData = navigator.connection?.saveData;
    if (reduce || saveData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setManual(true);
      setSrc(mp4);
      return;
    }

    const nearObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSrc(mp4);
          nearObs.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    const viewObs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.25 }, // chhoto screen e shohoje trigger hoy
    );

    nearObs.observe(video);
    viewObs.observe(video);
    return () => {
      nearObs.disconnect();
      viewObs.disconnect();
    };
  }, [mp4]);

  // 2) Dekha gele play, na dekha gele pause (user nijer pause korle abar auto play hobe na)
  useEffect(() => {
    const video = ref.current;
    if (!video || manual || !src) return;
    if (visible && !userPaused) video.play().catch(() => {});
    else video.pause();
  }, [visible, userPaused, src, manual]);

  return (
    <div className={`relative ${className}`}>
      <video
        ref={ref}
        src={src ?? undefined}
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload={src && !manual ? "auto" : "none"}
        controls={manual}
        disablePictureInPicture
        aria-label={label}
        className="block h-auto w-full"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        Your browser does not support the video tag.
      </video>

      {/* Autoplay video te pause korar upay thaka accessibility er niyom */}
      {!manual && src && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={userPaused ? "Play video" : "Pause video"}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="currentColor"
          >
            {userPaused ? (
              <path d="M8 5v14l11-7z" />
            ) : (
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
}
