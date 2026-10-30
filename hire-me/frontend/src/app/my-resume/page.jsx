"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import ResumeBTN from "../components/ResumeBTN";
import { Button } from "../components/Button";
import RecentResumeCard from "../components/RecentResumeCard";
import ResumePreviewModal from "../components/resumes/ResumePreviewModal";
import ResumeThumb from "../components/resumes/ResumeThumb";
import useUndoableDelete from "@/app/hooks/useUndoableDelete";
import { copyText } from "@/lib/share";
import { usePrintResume } from "@/resume/engine/usePrintResume";
import { getTemplate } from "@/resume/templates/registry";
import { useGetMeQuery } from "@/store/api/authApi";
import {
  useDeleteResumeMutation,
  useDuplicateResumeMutation,
  useLazyGetResumeQuery,
  useListResumesQuery,
  useShareResumeMutation,
} from "@/store/api/resumeApi";
import { resetBuilder } from "@/store/builder/builderSlice";
import ExploreTemplates from "../components/ExploreTemplates";

const MY_RESUME_PATH = "/my-resume";
const PAGE_SIZE = 12;
// How long the "Undo" toast stays. The real delete request is sent after this.
const UNDO_DELAY = 5000;
// One arrow click scrolls this share of the visible width.
const SCROLL_STEP = 0.8;

// Card width: 13rem on a 320px screen, growing evenly to 17rem at 1440px, fixed after that.
// The real cards and the loading skeleton share it, so they always match.
const CARD_WIDTH = "w-[clamp(13rem,calc(5.714vw+11.857rem),17rem)]";
const CARD_GAP = "gap-[clamp(1.25rem,calc(1.127vw+0.986rem),2rem)]";
// Side padding of the list = width of the arrows, so the arrows never cover a card at rest.
const TRACK_PADDING = "px-2 sm:px-2 scroll-px-2 sm:scroll-px-2";

const parsePage = (value) => {
  const page = Number.parseInt(value ?? "", 10);
  return Number.isFinite(page) && page >= 1 ? Math.min(page, 1000) : 1;
};

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
const updatedLabel = (iso) =>
  iso ? `Updated ${dateFormat.format(new Date(iso))}` : "";

const CardSkeleton = () => (
  <div
    className={`aspect-210/340 shrink-0 animate-pulse rounded-md bg-neutral-200/70 ${CARD_WIDTH}`}
  />
);

// Gradient arrow on one side of the carousel
const EdgeArrow = ({ side, label, onClick }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`group absolute top-0 z-20 flex h-full w-8 items-center justify-center outline-none sm:w-11 ${
      side === "left"
        ? "left-0 bg-linear-to-r from-background to-transparent"
        : "right-0 bg-linear-to-l from-background to-transparent"
    }`}
  >
    <span className="rounded-full p-1.5 group-hover:bg-primary-300/10 group-focus-visible:ring-[3px] group-focus-visible:ring-indigo-300 sm:p-2">
      <i
        aria-hidden="true"
        className={`fi ${side === "left" ? "fi-rr-angle-small-left" : "fi-rr-angle-small-right"} inline-block text-[20px] text-primary-200 group-hover:scale-110 group-hover:text-primary-300`}
      ></i>
    </span>
  </button>
);

function MyResumes() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const store = useStore();
  const page = parsePage(searchParams.get("page"));

  const {
    data: user,
    isLoading: userLoading,
    isError: meFailed,
    error: meError,
  } = useGetMeQuery();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useListResumesQuery({ page, limit: PAGE_SIZE }, { skip: !user });
  const [deleteResume] = useDeleteResumeMutation();
  const [duplicateResume] = useDuplicateResumeMutation();
  const [shareResume] = useShareResumeMutation();
  const [fetchResume] = useLazyGetResumeQuery();
  const undoableDelete = useUndoableDelete({ delay: UNDO_DELAY });
  const printResume = usePrintResume();

  const [previewing, setPreviewing] = useState(null);
  const [busyId, setBusyId] = useState(null);
  // Ids of resumes the user deleted that are still inside the Undo window (or being deleted on the server).
  const [hiddenIds, setHiddenIds] = useState(() => new Set());
  const [message, setMessage] = useState({ text: "", tone: "info" });
  const timer = useRef(null);

  // Carousel: the scrolling list, whether it sits at its left / right end, and where to land after a page change.
  const trackRef = useRef(null);
  const landAtEnd = useRef(false);
  const [edge, setEdge] = useState({ start: true, end: true });

  const isLoggedOut =
    meFailed &&
    (meError?.status === 401 || meError?.code === "UNAUTHENTICATED");

  // Guests cannot see this page: log in, then come back here.
  useEffect(() => {
    if (isLoggedOut)
      router.replace(`/login?next=${encodeURIComponent(MY_RESUME_PATH)}`);
  }, [isLoggedOut, router]);

  // Deleting the last resume of a page: go back to the previous page instead of showing an empty one.
  const lastPage = data?.pagination.totalPages;
  useEffect(() => {
    if (data && data.resumes.length === 0 && page > 1)
      router.replace(
        `${MY_RESUME_PATH}?page=${Math.min(page - 1, lastPage ?? 1)}`,
      );
  }, [data, page, lastPage, router]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const notify = (text, tone = "info") => {
    setMessage({ text, tone });
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setMessage({ text: "", tone: "info" }),
      5000,
    );
  };

  // Runs one action on one card (the card's buttons are disabled meanwhile) and reports what happened.
  const run = async (item, action, failure) => {
    setBusyId(item.id);
    try {
      await action();
    } catch (err) {
      notify(err?.message || failure, "error");
    } finally {
      setBusyId(null);
    }
  };

  const setHidden = (id, hide) =>
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (hide) next.add(id);
      else next.delete(id);
      return next;
    });

  const handleEdit = (item) => router.push(`/builder?resume=${item.id}`);

  const handleDuplicate = (item) =>
    run(
      item,
      async () => {
        await duplicateResume(item.id).unwrap();
        notify(`A copy of "${item.title}" was created.`);
      },
      "We could not duplicate this resume.",
    );

  const handleCopyLink = (item) =>
    run(
      item,
      async () => {
        // A resume that is not shared yet gets its link now (the same link every time after that).
        const url =
          item.shareUrl ?? (await shareResume({ id: item.id }).unwrap()).url;
        const copied = await copyText(url);
        notify(
          copied
            ? item.shareUrl
              ? "Link copied."
              : "Sharing is on now. Link copied."
            : `Copy this link by hand: ${url}`,
          copied ? "info" : "error",
        );
      },
      "We could not get the share link.",
    );

  const handleDownload = (item) =>
    run(
      item,
      async () => {
        const resume = await fetchResume(item.id, true).unwrap();
        printResume({
          template: getTemplate(resume.design?.templateId),
          data: resume,
          color: resume.design?.color,
        });
      },
      "We could not prepare the download.",
    );

  // The card disappears at once and an "Undo" toast shows. The server delete only runs
  // after UNDO_DELAY; Undo cancels it, and a failed delete brings the card back.
  const handleDelete = (item) =>
    undoableDelete({
      key: item.id,
      message: `"${item.title}" deleted`,
      remove: () => setHidden(item.id, true),
      restore: () => setHidden(item.id, false),
      commit: async () => {
        await deleteResume(item.id).unwrap();
        // If it was the resume open in the builder, forget the draft, or the builder would save it again as a new resume.
        if (store.getState().builder.resumeId === item.id)
          dispatch(resetBuilder());
      },
    });

  // scroll: false keeps the window where it is; only the carousel changes.
  const goToPage = (next) =>
    router.push(
      next === 1 ? MY_RESUME_PATH : `${MY_RESUME_PATH}?page=${next}`,
      { scroll: false },
    );

  const loading = userLoading || isLoggedOut || (user && isLoading);
  const resumes = (data?.resumes ?? []).filter(
    (item) => !hiddenIds.has(item.id),
  );
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  // A real "no resumes yet" state (page 1 only: an empty page 2+ is redirected above).
  const showEmpty =
    Boolean(user && data) && !isError && page === 1 && resumes.length === 0;

  /* ---------- carousel ---------- */

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const next = { start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 };
    setEdge((prev) =>
      prev.start === next.start && prev.end === next.end ? prev : next,
    );
  }, []);

  // Keep the arrows right whenever the list or its cards change size: window resize, a sidebar
  // opening, fonts loading, cards coming and going (delete / undo). A ResizeObserver sees all of
  // these, a window "resize" listener only sees the first.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [updateEdges, resumes.length]);

  // A new page of resumes arrived: start at its first card, or at its last card when the user came back from the next page.
  const shownPage = pagination?.page;
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({
      left: landAtEnd.current ? el.scrollWidth : 0,
      behavior: "instant",
    });
    landAtEnd.current = false;
    updateEdges();
  }, [shownPage, updateEdges]);

  // Arrows scroll smoothly. At the end of the list they move on to the next / previous page of resumes.
  const scrollLeft = () => {
    const el = trackRef.current;
    if (el && !edge.start) {
      el.scrollBy({ left: -el.clientWidth * SCROLL_STEP, behavior: "smooth" });
    } else if (page > 1) {
      landAtEnd.current = true;
      goToPage(page - 1);
    }
  };
  const scrollRight = () => {
    const el = trackRef.current;
    if (el && !edge.end) {
      el.scrollBy({ left: el.clientWidth * SCROLL_STEP, behavior: "smooth" });
    } else if (page < totalPages) {
      goToPage(page + 1);
    }
  };

  const canGoLeft = !edge.start || page > 1;
  const canGoRight = !edge.end || page < totalPages;

  return (
    <section className="px-[clamp(1.5rem,calc(2.254vw+0.972rem),3rem)] py-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)] gap-space-10 min-w-[320px] max-w-300 mx-auto *:w-full">
      {/* resume */}
      <div className="mb-space-10">
        <div className="flex items-center max-sm:flex-col gap-space-7 max-sm:items-start mb-space-7">
          <div className="w-full">
            <h1 className="text-[clamp(1.625rem,calc(0.939vw+1.405rem),2.25rem)] mb-space-3 font-semibold font-primary">
              Your Resume
            </h1>
            <p className="leading-[24px] text-neutral-500">
              Every resume you made, newest first. Open one to keep editing: it
              stays the same resume and keeps the same share link.
            </p>
          </div>
          <ResumeBTN href="/create-resume" />
        </div>

        {/* role="alert" / "status" already carry the live-region behaviour */}
        <p
          role={message.tone === "error" ? "alert" : "status"}
          className={`mb-4 min-h-6 text-small ${message.tone === "error" ? "text-red-600" : "text-green-600"}`}
        >
          {message.text}
        </p>

        {loading && (
          <div
            aria-label="Loading your resumes"
            role="status"
            className={`flex overflow-hidden py-2 ${CARD_GAP} ${TRACK_PADDING}`}
          >
            {[0, 1, 2].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        )}

        {user && isError && (
          <div
            role="alert"
            className="flex flex-col items-start gap-3 rounded-lg bg-red-500/5 p-4 text-red-600"
          >
            <p>{error?.message ?? "We could not load your resumes."}</p>
            <Button type="button" variant="secondary" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        )}

        {showEmpty && (
          <p className="rounded-lg bg-neutral-100 p-6 text-center text-neutral-500">
            You have not made a resume yet. Create your first one with the
            button above.
          </p>
        )}

        {resumes.length > 0 && (
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Your resumes"
          >
            {/* The arrows sit next to the list, not inside it, so they stay put while the cards scroll.
                They come AFTER the list in the DOM and have a higher z-index: a card with its own
                stacking context (hover transform, z-index) can no longer paint over them. */}
            <div className="relative">
              <ul
                ref={trackRef}
                onScroll={updateEdges}
                aria-busy={isFetching}
                className={`flex snap-x snap-proximity overflow-x-auto scroll-smooth py-2 scrollbar-none transition-opacity [&::-webkit-scrollbar]:hidden ${CARD_GAP} ${TRACK_PADDING} ${isFetching ? "opacity-60" : ""}`}
              >
                {resumes.map((item) => (
                  // The <li> owns the width; the card fills it, so cards resize with the screen.
                  <li
                    key={item.id}
                    className={`shrink-0 snap-start *:w-full ${CARD_WIDTH}`}
                  >
                    <RecentResumeCard
                      thumbnail={
                        <ResumeThumb id={item.id} title={item.title} />
                      }
                      title={item.title}
                      subtitle={[
                        item.templateName,
                        updatedLabel(item.updatedAt),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                      atsScore={item.atsScore}
                      statusLabel={
                        item.status === "generated" ? "Generated" : "Draft"
                      }
                      shared={item.shared}
                      busy={busyId === item.id}
                      onPreview={() =>
                        setPreviewing({ id: item.id, title: item.title })
                      }
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDelete(item)}
                      onDownload={() => handleDownload(item)}
                      onDuplicate={() => handleDuplicate(item)}
                      onCopyLink={() => handleCopyLink(item)}
                    />
                  </li>
                ))}
              </ul>

              {canGoLeft && (
                <EdgeArrow
                  side="left"
                  label={
                    edge.start
                      ? "Previous page of resumes"
                      : "Scroll resumes left"
                  }
                  onClick={scrollLeft}
                />
              )}

              {canGoRight && (
                <EdgeArrow
                  side="right"
                  label={
                    edge.end ? "Next page of resumes" : "Scroll resumes right"
                  }
                  onClick={scrollRight}
                />
              )}
            </div>

            {/* pages: part of the carousel now, the arrows above move between them */}
            {pagination && pagination.totalPages > 1 && (
              <p
                aria-live="polite"
                className="mt-3 text-center text-small text-neutral-500"
              >
                Page {pagination.page}{" "}
                <span className="text-caption">/ {pagination.totalPages}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Explore Templates */}
      <ExploreTemplates />

      <ResumePreviewModal
        id={previewing?.id ?? null}
        title={previewing?.title}
        onClose={() => setPreviewing(null)}
      />
    </section>
  );
}

// useSearchParams needs a Suspense boundary in the App Router
const Page = () => (
  <Suspense fallback={null}>
    <MyResumes />
  </Suspense>
);

export default Page;
