"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { icons } from "../../../../assets/iconCollection";
import { SHARE_TARGETS, canShareNatively, copyText, shareNatively } from "@/lib/share";
import { Button } from "../Button";
import FinalPreview from "./FinalPreview";

const TARGET_ICONS = {
  facebook: icons.facebook_violet,
  linkedin: icons.linkedin_violet,
  x: icons.twitter_violet,
  whatsapp: icons.whatsapp_violet,
  telegram: icons.telegram_violet,
};

const SHARE_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-transparent bg-violet-500/5 px-4 text-[clamp(0.75rem,calc(-0.188vw+0.919rem),0.875rem)] font-medium text-violet-500 outline-none transition-colors hover:bg-violet-500/10 focus-visible:ring-[3px] focus-visible:ring-indigo-300";

// false on the server, the real answer in the browser (the share sheet exists on phones and some desktops)
const subscribe = () => () => {};
const useNativeShare = () => useSyncExternalStore(subscribe, canShareNatively, () => false);

/**
 * The content of the "Your resume is ready" dialog: preview, download, the share link, social buttons,
 * and the owner's controls (turn the link off, show / hide contact details).
 */
const FinalPreviewModal = ({
  shareUrl,
  sharingOn,
  hideContact,
  busy,
  error,
  isLoggedIn,
  shareText,
  isDownloading,
  onDownload,
  onLogin,
  onToggleSharing,
  onToggleHideContact,
}) => {
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const timer = useRef(null);
  const nativeShare = useNativeShare();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const done = await copyText(shareUrl);
    setCopied(done);
    setNotice(done ? "" : "Could not copy. Select the link and copy it by hand.");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  const shareWithPhone = async () => {
    const result = await shareNatively({ url: shareUrl, title: shareText, text: shareText });
    if (result === "failed") await copy(); // no share sheet after all: copy instead
  };

  return (
    <div className="w-full p-[clamp(0.5rem,calc(2vw+0.2rem),2rem)] flex max-md:flex-col gap-[clamp(1.5rem,calc(2.909vw+0.818rem),3rem)] items-center md:*:flex-1">
      <FinalPreview />
      <section className="flex flex-col items-center *:w-full">
        <h1 className="font-primary font-semibold text-[clamp(1.375rem,calc(0.727vw+1.205rem),1.75rem)] mb-[clamp(0.5rem,calc(0.485vw+0.386rem),0.75rem)]">
          Your Resume is Ready
        </h1>
        <p className="text-neutral-500 text-[clamp(0.875rem,calc(0.242vw+0.818rem),1rem)] mb-[clamp(1.5rem,calc(0.97vw+1.273rem),2rem)]">
          Review your completed resume, then share it with employers or download a polished copy for your next opportunity.
        </p>

        <div className="flex items-center gap-space-4 max-sm:flex-col *:flex-1 mb-space-4">
          <Button icon={icons.resume} onClick={onDownload} loading={isDownloading} disabled={isDownloading}>
            Download PDF
          </Button>
          {isLoggedIn ? (
            <Link href="/my-resume" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-500/5 px-4 font-medium text-violet-500 hover:bg-violet-500/10">
              <i className={icons.user} aria-hidden="true"></i> My resumes
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={(event) => {
                if (!onLogin) return;
                event.preventDefault();
                onLogin(); // remembers that the review is still to come, then goes to the login page
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-500/5 px-4 font-medium text-violet-500 hover:bg-violet-500/10"
            >
              <i className={icons.user} aria-hidden="true"></i> Login
            </Link>
          )}
        </div>
        {!isLoggedIn && (
          <div className="flex items-center gap-space-0 justify-center text-blue-500 text-body mb-space-8">
            <i className={icons.information} aria-hidden="true"></i>
            <p className="text-[12px] font-medium ml-2">Login to securely save your resume and update it anytime.</p>
          </div>
        )}

        {/* share */}
        <div className="flex items-center gap-[clamp(0.5rem,calc(0.606vw+0.358rem),0.8125rem)] mb-[clamp(1rem,calc(0.97vw+0.773rem),1.5rem)]">
          <span className="flex-1 h-px bg-neutral-300/50 rounded-full" />
          <p className="text-[clamp(0.875rem,calc(0.242vw+0.818rem),1rem)] text-neutral-300">Share with</p>
          <span className="flex-1 h-px bg-neutral-300/50 rounded-full" />
        </div>

        {error && (
          <p role="alert" className="mb-space-4 rounded-md bg-red-500/5 p-space-3 text-small text-red-600">
            {error}
          </p>
        )}

        {sharingOn ? (
          <>
            {/* copy link */}
            <div className="flex items-center p-space-2 rounded-lg gap-space-2 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] mb-space-6 max-w-full">
              <div className="flex min-w-0 items-center gap-2.5 px-space-2">
                <i className={`${icons.link} text-[14px] text-neutral-500`} aria-hidden="true"></i>
                <input
                  readOnly
                  value={shareUrl}
                  aria-label="Your share link"
                  onFocus={(event) => event.target.select()}
                  className="w-full min-w-0 truncate bg-transparent text-neutral-500/70 outline-none"
                />
              </div>
              <Button icon={icons.copy} variant="secondary" onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p aria-live="polite" className="-mt-4 mb-space-4 min-h-4 text-[12px] text-red-600">
              {notice}
            </p>

            <ul className="flex flex-wrap items-center gap-[clamp(0.5rem,calc(1vw+0.3rem),1rem)] mb-[clamp(1rem,calc(1.5vw+0.8rem),1.75rem)]">
              {SHARE_TARGETS.map((target) => (
                <li key={target.id}>
                  <a href={target.href(shareUrl, shareText)} target="_blank" rel="noopener noreferrer" className={SHARE_BUTTON}>
                    {TARGET_ICONS[target.id] ? (
                      <Image alt="" src={TARGET_ICONS[target.id]} width={22} height={22} className="size-[clamp(1.125rem,calc(0.485vw+1.011rem),1.375rem)]" />
                    ) : (
                      <i className="fi fi-rr-envelope text-[18px]" aria-hidden="true"></i>
                    )}
                    {target.label}
                  </a>
                </li>
              ))}
              {nativeShare && (
                <li>
                  <button type="button" onClick={shareWithPhone} className={SHARE_BUTTON}>
                    <i className="fi fi-rr-share text-[18px]" aria-hidden="true"></i>
                    More…
                  </button>
                </li>
              )}
            </ul>
          </>
        ) : (
          <p className="mb-space-6 rounded-md bg-neutral-500/5 p-space-4 text-small text-neutral-500">
            Sharing is off. Nobody can open your link until you turn it on again.
          </p>
        )}

        {/* the owner's controls */}
        <div className="mb-space-6 flex flex-col gap-space-3 rounded-md border border-neutral-500/10 p-space-4 text-small">
          <div className="flex items-center justify-between gap-3">
            <p className="text-neutral-500">{sharingOn ? "Anyone with the link can view this resume." : "Your link is turned off."}</p>
            <Button variant="text" onClick={onToggleSharing} disabled={busy} className={sharingOn ? "text-red-500 hover:text-red-600" : "text-green-500"}>
              {sharingOn ? "Turn off sharing" : "Turn on sharing"}
            </Button>
          </div>
          {sharingOn && (
            <label className="flex cursor-pointer items-start gap-2 text-neutral-500">
              <input type="checkbox" checked={!hideContact} disabled={busy} onChange={(event) => onToggleHideContact(!event.target.checked)} className="mt-1 size-4 accent-violet-500" />
              <span>Show my email and phone number on the shared page (hidden by default)</span>
            </label>
          )}
        </div>

        <div className="flex items-center rounded-md bg-green-500/5 gap-space-4 p-space-4">
          <div>
            <h2 className="text-small font-medium text-green-500 mb-1.5">Your information is safe and secure</h2>
            <p className="text-[12px] text-green-300">Your personal information is protected with care. We keep your data private and never share it.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinalPreviewModal;
