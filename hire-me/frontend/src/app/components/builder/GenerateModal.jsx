'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePrintResume } from '@/resume/engine/usePrintResume';
import { getTemplate } from '@/resume/templates/registry';
import { BUILDER_PATH, rememberReturnTo } from '@/lib/returnTo';
import {
  buildShareText,
  facebookShareUrl,
  linkedinShareUrl,
  openSharePopup,
  shareNatively,
  twitterShareUrl,
} from '@/lib/share';
import { useGetMeQuery } from '@/store/api/authApi';
import { useShareResumeMutation } from '@/store/api/resumeApi';
import { saveBuilderNow } from '@/store/builder/saveBuilderNow';
import { Button } from '../Button';

/**
 * Opens after the user clicks "Generate".
 *  - everyone:  Download PDF (built in the browser, no account needed)
 *  - guests:    Log in / Create account (the draft is claimed automatically afterwards, see <BuilderSync />)
 *  - logged in: share link + Facebook / LinkedIn / X / Instagram
 *
 * @param {{ open: boolean, onClose: () => void }} props
 */
export default function GenerateModal({ open, onClose }) {
  const router = useRouter();
  const dialogRef = useRef(null);

  const { data: user } = useGetMeQuery();
  const builder = useSelector((state) => state.builder);
  const [shareResume] = useShareResumeMutation();

  const { printResume, printPortal, isPrinting } = usePrintResume();
  const [share, setShare] = useState(null); // { url, hideContact }
  const [hideContact, setHideContact] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');

  // The native <dialog> gives us focus trapping, Esc to close and the backdrop for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setMessage('');
  }, [open]);

  /**
   * Download PDF = the browser prints the exact pages the live preview shows (same template, colour and page
   * breaks) and the user saves them as a PDF. Works for guests too - no server involved.
   */
  const handleDownload = () => {
    setMessage('');
    printResume({ template: getTemplate(builder.design.templateId), data: builder.content, color: builder.design.color });
  };

  const goToAuth = (path) => {
    rememberReturnTo(BUILDER_PATH); // the login / verify pages send the user back here afterwards
    onClose();
    router.push(path);
  };

  /** Creates (or updates) the share link. Same link every time - only the privacy switch changes. */
  const createLink = async (nextHideContact = hideContact) => {
    setBusy(true);
    setMessage('');
    try {
      const { resumeId } = await saveBuilderNow(); // the resume must exist on the server first
      if (!resumeId) throw new Error('Your resume could not be saved yet. Please try again.');
      setShare(await shareResume({ id: resumeId, hideContact: nextHideContact }).unwrap());
    } catch (error) {
      setMessage(error?.message ?? 'Could not create the link. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const toggleContact = (event) => {
    setHideContact(!event.target.checked);
    if (share) createLink(!event.target.checked);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(share.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const text = buildShareText(builder.content);
  const socials = [
    { id: 'facebook', label: 'Facebook', icon: 'fi fi-brands-facebook', color: 'text-[#1877f2] bg-[#1877f2]/10 hover:bg-[#1877f2]/15', run: () => openSharePopup(facebookShareUrl(share.url)) },
    { id: 'linkedin', label: 'LinkedIn', icon: 'fi fi-brands-linkedin', color: 'text-[#0a66c2] bg-[#0a66c2]/10 hover:bg-[#0a66c2]/15', run: () => openSharePopup(linkedinShareUrl(share.url)) },
    { id: 'twitter', label: 'Twitter / X', icon: 'fi fi-brands-twitter', color: 'text-neutral-500 bg-neutral-500/10 hover:bg-neutral-500/15', run: () => openSharePopup(twitterShareUrl(share.url, text)) },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: 'fi fi-brands-instagram',
      color: 'text-[#e4405f] bg-[#e4405f]/10 hover:bg-[#e4405f]/15',
      // Instagram has no web share link: phones open the share sheet, desktops get the link copied.
      run: async () => {
        const result = await shareNatively({ url: share.url, title: text, text });
        if (result === 'copied') setMessage('Link copied. Paste it into your Instagram bio, story or message.');
      },
    },
  ];

  const savedToAccount = Boolean(user && builder.resumeId && builder.status !== 'error' && builder.status !== 'conflict');

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose(); // click on the backdrop
      }}
      className="m-auto max-h-[90vh] w-[min(92vw,34rem)] overflow-y-auto rounded-2xl border border-neutral-500/10 bg-white p-0 shadow-[0_24px_48px_rgba(2,6,23,0.18)] backdrop:bg-neutral-900/40"
    >
      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-h5 font-semibold">Your resume is ready</h2>
            <p className="text-small text-neutral-500/70">Download it now{user ? ' or share it with the world.' : ', and log in to save and share it.'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-9 items-center justify-center rounded-full text-neutral-500/60 hover:bg-neutral-500/10">
            <i className="fi fi-rr-cross-small text-xl" />
          </button>
        </div>

        {/* Download - works for everyone */}
        <div className="flex items-center justify-between gap-4 rounded-xl bg-green-500/5 p-4">
          <div>
            <p className="font-medium">Download as PDF</p>
            <p className="text-small text-neutral-500/70">Same pages as the preview. In the print window choose <strong>Save as PDF</strong>.</p>
          </div>
          <Button variant="secondary" icon="fi fi-rr-file-download" className="bg-green-500/5 text-green-500 hover:bg-green-500/10" onClick={handleDownload} disabled={isPrinting}>
            {isPrinting ? 'Preparing...' : 'Download'}
          </Button>
        </div>

        {!user ? (
          <div className="flex flex-col gap-3 rounded-xl bg-blue-500/5 p-4">
            <p className="font-medium text-blue-500">Save it, share it, reuse it</p>
            <p className="text-small text-neutral-500/80">
              Log in or create a free account to keep this resume, get a link you can share, and have your details filled in automatically next time.
            </p>
            <div className="flex gap-3 *:flex-1">
              <Button variant="primary" onClick={() => goToAuth('/login')}>Log in</Button>
              <Button variant="secondary" onClick={() => goToAuth('/sign-up')}>Create account</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-xl border border-neutral-500/10 p-4">
            <div>
              <p className="font-medium">Share your resume</p>
              {savedToAccount ? (
                <p className="text-small text-neutral-500/70">Saved to your account. Your details will pre-fill your next resume.</p>
              ) : null}
            </div>

            <label className="flex items-center gap-2 text-small text-neutral-500/80">
              <input type="checkbox" checked={!hideContact} onChange={toggleContact} />
              Show my email and phone on the public page
            </label>

            {share ? (
              <div className="flex items-center gap-2">
                <input readOnly value={share.url} onFocus={(event) => event.target.select()} className="min-w-0 flex-1 rounded-lg border border-neutral-500/15 bg-neutral-500/5 px-3 py-2 text-small" aria-label="Public link" />
                <Button variant="secondary" icon="fi fi-rr-copy" onClick={copyLink}>{copied ? 'Copied' : 'Copy'}</Button>
              </div>
            ) : (
              <Button variant="secondary" icon="fi fi-rr-link-alt" onClick={() => createLink()} disabled={busy}>
                {busy ? 'Creating link...' : 'Generate share link'}
              </Button>
            )}

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {socials.map(({ id, label, icon, color, run }) => (
                <button key={id} type="button" disabled={!share} onClick={run} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-small font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${color}`}>
                  <i className={icon} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {message ? <p role="status" className="text-small text-red-500">{message}</p> : null}
      </div>
      {printPortal}
    </dialog>
  );
}
