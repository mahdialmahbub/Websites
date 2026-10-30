"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";

import Education from "@/app/components/builder/Education";
import Experience from "@/app/components/builder/Experience";
import ImageUpload from "@/app/components/builder/ImageUpload";
import Language from "@/app/components/builder/Language";
import Project from "@/app/components/builder/Project";
import ProfessionalSummary from "@/app/components/builder/ProfessionalSummary";
import Reference from "@/app/components/builder/Reference";
import Skill from "@/app/components/builder/Skill";
import { FormTarget } from "@/app/components/builder/formTarget";
import { useSection } from "@/app/components/builder/useSection";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import ProfileNavbar from "@/app/components/profile/ProfileNav";
import { LIMITS, validateAll } from "@/resume/validation";
import { useGetMeQuery } from "@/store/api/authApi";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/api/profileApi";
import { useUploadPhotoMutation } from "@/store/api/uploadApi";
import { PROFILE_SECTIONS } from "@/store/builder/builderModel";
import { markAttempted, profileDiscarded, profileLoaded, profileSaved } from "@/store/profile/profileDraftSlice";

const EDIT_PATH = "/profile/edit";

// key = what ?tab=... accepts (the profile page's "Add ..." buttons link here), section = the data it edits
const TABS = [
  { key: "personal", text: "Personal Information", section: "personalInformation" },
  { key: "summary", text: "Professional Summary", section: "professionalSummary" },
  { key: "experience", text: "Work Experience", section: "workExperience" },
  { key: "education", text: "Education", section: "education" },
  { key: "skills", text: "Skill", section: "skills" },
  { key: "projects", text: "Project", section: "projects" },
  { key: "languages", text: "Language", section: "languages" },
  { key: "references", text: "Reference", section: "references" },
];

const pageGap = "gap-[clamp(0.75rem,calc(0.751vw+0.574rem),1.25rem)]";

/** Photo, name and title at the top of the editor. They are part of "personal information". */
function HeaderFields() {
  const { value, dispatch, actions, field } = useSection("personalInformation");
  const [uploadPhoto] = useUploadPhotoMutation();
  const set = (key) => (event) => dispatch(actions.updateField({ section: "personalInformation", field: key, value: event.target.value }));

  const handleUpload = async (file) => {
    const photo = await uploadPhoto(file).unwrap();
    dispatch(actions.updateField({ section: "personalInformation", field: "photo", value: photo }));
    return photo.url;
  };

  return (
    <div className="flex items-center gap-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)] max-md:flex-col *:flex-1">
      <ImageUpload className="max-md:mb-6.5" value={value.photo?.url ?? null} onUpload={handleUpload} />
      <div className="w-full space-y-space-8 rounded-lg">
        <Input label="Full Name" labelIcon="fi fi-rr-user" placeholder="John Doe" requiredLabel maxLength={LIMITS.fullName} value={value.fullName} onChange={set("fullName")} {...field("fullName")} />
        <Input label="Professional Title" labelIcon="fi fi-rr-briefcase" placeholder="Frontend Developer" maxLength={LIMITS.professionalTitle} value={value.professionalTitle} onChange={set("professionalTitle")} {...field("professionalTitle")} />
      </div>
    </div>
  );
}

/** The contact fields of the "Personal Information" tab. */
function ContactFields() {
  const { value, dispatch, actions, field } = useSection("personalInformation");
  const set = (key) => (event) => dispatch(actions.updateField({ section: "personalInformation", field: key, value: event.target.value }));

  return (
    <div className="space-y-space-8 *:w-full">
      <Input label="Email Address" labelIcon="fi fi-rr-envelope" placeholder="youremail@gmail.com" type="email" autoComplete="email" requiredLabel maxLength={LIMITS.email} value={value.email} onChange={set("email")} {...field("email")} />
      <Input label="Phone Number" labelIcon="fi fi-rr-phone-flip" placeholder="+880 1XXXXXXXXX" type="tel" autoComplete="tel" maxLength={LIMITS.phone} value={value.phone} onChange={set("phone")} {...field("phone")} />
      <Input label="Location" labelIcon="fi fi-rr-marker" placeholder="Dhaka, Bangladesh" maxLength={LIMITS.location} value={value.location} onChange={set("location")} {...field("location")} />
      <Input label="LinkedIn Profile" labelIcon="fi fi-rr-briefcase" placeholder="linkedin.com/in/yourname" inputMode="url" maxLength={LIMITS.url} value={value.linkedin} onChange={set("linkedin")} {...field("linkedin")} />
      <Input label="Personal Website" labelIcon="fi fi-rr-site-alt" placeholder="yourwebsite.com" inputMode="url" maxLength={LIMITS.url} value={value.website} onChange={set("website")} {...field("website")} />
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div role="status" aria-label="Loading your profile" className="mx-auto my-8 w-full max-w-200 animate-pulse space-y-6 p-6">
      <div className="h-40 rounded-xl bg-neutral-200" />
      <div className="h-10 rounded-lg bg-neutral-200" />
      <div className="h-64 rounded-xl bg-neutral-200/70" />
    </div>
  );
}

function ProfileEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const store = useStore();
  const formRef = useRef(null);

  const { data: user, isLoading: userLoading, isError: meFailed, error: meError } = useGetMeQuery();
  const { data: profile, isLoading: profileLoading, isError: profileFailed, error: profileError, refetch } = useGetProfileQuery(undefined, { skip: !user });
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

  const loaded = useSelector((state) => state.profileDraft.loaded);
  const dirty = useSelector((state) => Object.keys(state.profileDraft.dirty).length > 0);

  const startTab = TABS.find((tab) => tab.key === searchParams.get("tab"))?.key ?? TABS[0].key;
  const [active, setActive] = useState(startTab);
  const [saveError, setSaveError] = useState("");

  const isLoggedOut = meFailed && (meError?.status === 401 || meError?.code === "UNAUTHENTICATED");

  // Not logged in -> login, then come back here
  useEffect(() => {
    if (isLoggedOut) router.replace(`/login?next=${encodeURIComponent(EDIT_PATH)}`);
  }, [isLoggedOut, router]);

  // The saved profile becomes the editable draft (once per visit)
  useEffect(() => {
    if (profile && !loaded) dispatch(profileLoaded(profile));
  }, [profile, loaded, dispatch]);

  // Leaving the page forgets the draft: the next visit starts from the saved profile again
  useEffect(() => () => dispatch(profileDiscarded()), [dispatch]);

  // Closing the tab with unsaved changes asks first
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const focusFirstError = () => requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());

  const handleSave = async () => {
    if (saving) return;
    setSaveError("");
    const { content } = store.getState().profileDraft;

    // Same checks as the builder. A mistake sends you to its tab and shows its messages.
    const problems = validateAll(content);
    const firstBad = TABS.find((tab) => problems[tab.section]);
    if (firstBad) {
      for (const section of Object.keys(problems)) dispatch(markAttempted(section));
      setActive(firstBad.key);
      setSaveError("Please fix the highlighted fields before saving.");
      focusFirstError();
      return;
    }

    try {
      // Every one of the 8 profile sections is sent, so what you see here is exactly what gets saved.
      await updateProfile(Object.fromEntries(PROFILE_SECTIONS.map((section) => [section, content[section]]))).unwrap();
      dispatch(profileSaved());
      router.push("/profile?saved=1");
    } catch (err) {
      setSaveError(err?.message || "We could not save your profile. Please try again.");
    }
  };

  const handleCancel = () => {
    if (dirty && !window.confirm("Discard your changes?")) return;
    router.push("/profile");
  };

  if (userLoading || isLoggedOut || (user && profileLoading) || (profile && !loaded)) return <EditorSkeleton />;

  if (meFailed || profileFailed) {
    return (
      <div role="alert" className="mx-auto my-16 flex max-w-md flex-col items-center gap-4 rounded-xl bg-white p-8 text-center ring-1 ring-neutral-500/10">
        <p className="text-body text-red-500">{(meFailed ? meError : profileError)?.message ?? "Could not load your profile."}</p>
        <Button type="button" onClick={() => (profileFailed ? refetch() : window.location.reload())}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <FormTarget.Provider value="profile">
      <main ref={formRef} className="mx-auto w-full max-w-200 min-w-0 space-y-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)] p-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)] md:my-8 md:rounded-xl md:border md:border-neutral-500/20">
        <p className="rounded-lg bg-blue-500/5 p-3 text-small text-blue-500">
          This is the information your next resumes start with. Saving it never changes resumes you already made.
        </p>

        {/* Profile image, name and professional title */}
        <HeaderFields />

        {/* Navigation */}
        <div className="flex gap-[clamp(1rem,calc(1.502vw+0.648rem),2rem)]">
          <ProfileNavbar items={TABS} activeKey={active} onChange={setActive} label="Profile sections to edit" />
        </div>

        {/* Every section stays mounted (only hidden), so nothing is lost when you switch tabs */}
        {TABS.map((tab) => (
          <section key={tab.key} role="tabpanel" aria-label={tab.text} hidden={tab.key !== active} className={tab.key === active ? `flex flex-col ${pageGap}` : "hidden"}>
            {tab.key === "personal" && <ContactFields />}
            {tab.key === "summary" && <ProfessionalSummary />}
            {tab.key === "experience" && <Experience />}
            {tab.key === "education" && <Education />}
            {tab.key === "skills" && <Skill />}
            {tab.key === "projects" && <Project />}
            {tab.key === "languages" && <Language />}
            {tab.key === "references" && <Reference />}
          </section>
        ))}

        {/* Save / cancel */}
        <div className="sticky bottom-0 -mx-1 flex flex-col gap-2 border-t border-neutral-500/10 bg-white/95 px-1 py-3 backdrop-blur-sm">
          {saveError && (
            <p role="alert" className="rounded-md bg-red-500/5 p-2 text-small text-red-600">
              {saveError}
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <p aria-live="polite" className="text-[13px] font-medium text-neutral-500/80">
              {dirty ? "You have unsaved changes" : "No changes"}
            </p>
            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={handleCancel} disabled={saving} className="bg-red-500/5 text-red-500 hover:bg-red-500/10">
                Cancel
              </Button>
              <Button type="button" onClick={handleSave} loading={saving} disabled={saving || !dirty}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </FormTarget.Provider>
  );
}

// useSearchParams needs a Suspense boundary in the App Router
const Page = () => (
  <Suspense fallback={<EditorSkeleton />}>
    <ProfileEditor />
  </Suspense>
);

export default Page;
