"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
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
import HorizontalScroller from "../components/home/HorizontalScroller";

const MY_RESUME_PATH = "/my-resume";
const PAGE_SIZE = 12;
// How long the "Undo" toast stays. The real delete request is sent after this.
const UNDO_DELAY = 5000;

// Card width: 13rem on a 320px screen, growing evenly to 17rem at 1440px, fixed after that.
// The real cards and the loading skeleton share it, so they always match.
const CARD_WIDTH = "w-[clamp(13rem,calc(5.714vw+11.857rem),17rem)]";
const CARD_GAP = "gap-[clamp(1.25rem,calc(1.127vw+0.986rem),2rem)]";
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

  // scroll: false keeps the window where it is.
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

  return (
    <main className="space-y-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)] py-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)]">
      {/* resume */}
      <div className="mb-2 mx-auto min-w-[320px] max-w-300 px-[clamp(1rem,calc(6.01vw-0.41rem),5rem)]">
        <div className="flex items-center max-sm:flex-col gap-space-7 max-sm:gap-6 max-sm:items-start mb-7 ">
          <div className="w-full">
            <h1 className="text-[clamp(1.625rem,calc(0.939vw+1.405rem),2.25rem)] mb-2 font-semibold font-primary">
              Your Resume
            </h1>
            <p className="leading-[24px] text-neutral-500">
              Every resume you made, newest first. Open one to keep editing: it
              stays the same resume and keeps the same share link.
            </p>
          </div>
          <ResumeBTN href="/create-resume" />
        </div>


        {loading && (
          <div
            aria-label="Loading your resumes"
            role="status"
            className={`flex overflow-hidden py-2 ${CARD_GAP}`}
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
      </div>

      {/* Resume cards: padded on the left only, so the row runs off the right edge and shows it scrolls. */}
      {resumes.length > 0 && (
        <div className="mx-auto min-w-[320px] max-w-300">
          <div
            aria-busy={isFetching}
            className={`overflow-hidden pl-[clamp(1rem,calc(6.01vw-0.41rem),5rem)] transition-opacity ${isFetching ? "opacity-60" : ""}`}
          >
            <HorizontalScroller
              label="Your resumes"
              className={`py-2 ${CARD_GAP}`}
            >
              {resumes.map((item) => (
                // This wrapper owns the width; the card fills it, so cards resize with the screen.
                <div
                  key={item.id}
                  className={`shrink-0 *:w-full ${CARD_WIDTH}`}
                >
                  <RecentResumeCard
                    thumbnail={<ResumeThumb id={item.id} title={item.title} />}
                    title={item.title}
                    subtitle={[item.templateName, updatedLabel(item.updatedAt)]
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
                </div>
              ))}
            </HorizontalScroller>
          </div>

          {/* The scroller only moves within one page of resumes, so these move between pages. */}
          {pagination && totalPages > 1 && (
            <div className="mt-3 flex items-center justify-center gap-3 px-[clamp(1rem,calc(6.01vw-0.41rem),5rem)] text-small text-neutral-500">
              <Button
                type="button"
                variant="secondary"
                disabled={page <= 1 || isFetching}
                onClick={() => goToPage(page - 1)}
              >
                Prev
              </Button>
              <p aria-live="polite">
                Page {pagination.page}{" "}
                <span className="text-caption">/ {totalPages}</span>
              </p>
              <Button
                type="button"
                variant="secondary"
                disabled={page >= totalPages || isFetching}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Explore Templates */}
      <div className=" *:w-full *:overflow-hidden">
        <ExploreTemplates />
      </div>

      <ResumePreviewModal
        id={previewing?.id ?? null}
        title={previewing?.title}
        onClose={() => setPreviewing(null)}
      />
    </main>
  );
}

// useSearchParams needs a Suspense boundary in the App Router
const Page = () => (
  <Suspense fallback={null}>
    <MyResumes />
  </Suspense>
);

export default Page;
