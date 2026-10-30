"use client";

import React, { useState } from "react";
import { useStore } from "react-redux";
import { buildShareText } from "@/lib/share";
import { useGetMeQuery } from "@/store/api/authApi";
import { useShareResumeMutation, useUnshareResumeMutation } from "@/store/api/resumeApi";
import Modal from "../Modal";
import FinalPreviewModal from "./FinalPreviewModal";

/**
 * Opens after "Generate". `result` is what Generate returned: { resume, share: { enabled, url, hideContact } }.
 * The owner can turn the link off / on and choose whether email and phone show on the shared page.
 */
export default function ShareModal({ open, onClose, result, onDownload, isDownloading, onLogin }) {
  const store = useStore();
  const { data: user } = useGetMeQuery();
  const [shareResume] = useShareResumeMutation();
  const [unshareResume] = useUnshareResumeMutation();
  const [override, setOverride] = useState(null); // the latest share settings after the owner changed something
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const resumeId = result?.resume?.id;
const share = override?.forResume === resumeId && override ? override.share : result?.share;  if (!result || !share) return <Modal open={false} onClose={onClose} title="Your resume is ready" titleHidden />;

  const change = async (action) => {
    setBusy(true);
    setError("");
    try {
      const next = await action();
      setOverride({ forResume: resumeId, share: next });
    } catch (err) {
      setError(err?.message || "Could not change the sharing settings. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const toggleSharing = () =>
    change(async () => {
      if (share.enabled) {
        await unshareResume(resumeId).unwrap();
        return { ...share, enabled: false };
      }
      return shareResume({ id: resumeId, hideContact: share.hideContact }).unwrap();
    });

  const toggleHideContact = (hideContact) => change(() => shareResume({ id: resumeId, hideContact }).unwrap());

  const content = store.getState().builder.content;

  return (
    <Modal open={open} onClose={onClose} title="Your resume is ready" titleHidden wide>
      <FinalPreviewModal
        shareUrl={share.url ?? ""}
        sharingOn={Boolean(share.enabled && share.url)}
        hideContact={share.hideContact}
        busy={busy}
        error={error}
        isLoggedIn={Boolean(user)}
        shareText={buildShareText(content)}
        isDownloading={isDownloading}
        onDownload={onDownload}
        onLogin={onLogin}
        onToggleSharing={toggleSharing}
        onToggleHideContact={toggleHideContact}
      />
    </Modal>
  );
}
