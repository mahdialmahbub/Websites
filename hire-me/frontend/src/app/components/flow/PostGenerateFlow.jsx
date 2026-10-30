"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPendingReview, readPendingReview, rememberPendingReview } from "@/lib/pendingReview";
import { useGetMeQuery } from "@/store/api/authApi";
import { benefitsDismissed, leftForLogin, resumePendingReview, reviewFinished } from "@/store/flow/flowSlice";
import LoginBenefitsModal from "../builder/LoginBenefitsModal";
import ReviewModal from "../builder/ReviewModal";

/**
 * The steps after the share dialog closes. Mounted once in the root layout (it renders only dialogs) so it
 * survives the trip to the login page and back:
 *
 *   guest      -> benefits dialog -> review -> /create-resume
 *   logged in  ->                    review -> /my-resume
 *   guest picks Login / Register -> the review is remembered; once logged in it opens once -> /my-resume
 */
export default function PostGenerateFlow() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { stage, resumeId } = useSelector((state) => state.flow);
  const { data: user } = useGetMeQuery();

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Back from login / sign-up: the guest's review is still owed. Show it once, then forget it.
  useEffect(() => {
    if (!user || stage !== "idle") return;
    const pending = readPendingReview();
    if (!pending) return;
    clearPendingReview();
    dispatch(resumePendingReview(pending.resumeId));
  }, [user, stage, dispatch]);

  const goToAccountPage = useCallback(
    (path) => {
      dispatch(leftForLogin());
      router.push(path);
    },
    [dispatch, router],
  );

  // Login / Register: remember that the review is pending, then leave.
  const leaveForAuth = (path) => {
    rememberPendingReview(resumeId);
    goToAccountPage(path);
  };

  // The review is over (sent, or skipped, or the dialog was closed): where the person lands.
  const finishReview = useCallback(() => {
    dispatch(reviewFinished());
    router.push(userRef.current ? "/my-resume" : "/create-resume");
  }, [dispatch, router]);

  // A review without a resume cannot be sent (and there is nothing to ask about): just continue.
  useEffect(() => {
    if (stage === "review" && !resumeId) finishReview();
  }, [stage, resumeId, finishReview]);

  return (
    <>
      <LoginBenefitsModal
        open={stage === "benefits"}
        onLogin={() => leaveForAuth("/login")}
        onRegister={() => leaveForAuth("/sign-up")}
        onLater={() => dispatch(benefitsDismissed())}
      />
      <ReviewModal open={stage === "review" && Boolean(resumeId)} resumeId={resumeId} isGuest={!user} onDone={finishReview} />
    </>
  );
}
