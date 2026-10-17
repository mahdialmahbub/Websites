"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fluid } from "./fluid";
import { useGetAuthProvidersQuery } from "@/store/api/authApi";
import { oauthUrl } from "@/lib/oauth";

const PROVIDERS = [
  {
    id: "google",
    label: "Google",
    className:
      "bg-neutral-50 text-neutral-950 sm:border sm:border-neutral-200",
    icon: (
      <Image
        src="/googleLogo.svg"
        alt=""
        width={30}
        height={30}
        className={fluid.googleIcon}
      />
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    className: "bg-[#0A66C2] text-neutral-50",
    icon: (
      <i
        className={`fi fi-brands-linkedin leading-none ${fluid.socialIcon}`}
        aria-hidden="true"
      />
    ),
  },
];

/**
 * "or" divider + one button per provider the backend has enabled.
 * Renders nothing while loading or when no provider is configured.
 */
const SocialAuth = ({ next, disabled = false }) => {
  const { data: providers } = useGetAuthProvidersQuery();
  const [redirectingTo, setRedirectingTo] = useState(null);

  // Coming back with the browser's Back button restores the page from bfcache
  // with the old state, so re-enable the buttons.
  useEffect(() => {
    const reset = (e) => e.persisted && setRedirectingTo(null);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const enabled = PROVIDERS.filter((p) => providers?.[p.id]);
  if (!enabled.length) return null;

  const handleClick = (id) => {
    setRedirectingTo(id);
    // undefined `next` -> oauthUrl's own default ("/")
    window.location.assign(oauthUrl(id, next));
  };

  return (
    <>
      {/* Divider */}
      <div
        className={`flex items-center text-neutral-300 ${fluid.dividerMy} ${fluid.gapMd}`}
      >
        <span className="h-px flex-1 rounded-full bg-current opacity-50" />
        <span className={`font-medium uppercase ${fluid.orText}`}>or</span>
        <span className="h-px flex-1 rounded-full bg-current opacity-50" />
      </div>

      {/* Social login */}
      <div className={`flex *:flex-1 ${fluid.gapMd}`}>
        {enabled.map(({ id, label, className, icon }) => (
          <button
            key={id}
            type="button"
            aria-label={`Continue with ${label}`}
            disabled={disabled || redirectingTo !== null}
            onClick={() => handleClick(id)}
            className={`flex min-h-11 items-center justify-center rounded-xs disabled:cursor-not-allowed disabled:opacity-60 ${fluid.socialH} ${className}`}
          >
            {icon}
          </button>
        ))}
      </div>
    </>
  );
};

export default SocialAuth;
