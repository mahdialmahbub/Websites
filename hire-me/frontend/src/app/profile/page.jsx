"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { icons } from "../../../assets/iconCollection";
import BTNDropdown from "../components/profile/BTNDropdown";
import FieldDropdown from "../components/profile/FieldDropdown";
import AddField from "../components/profile/AddField";
import { ProfileIcon } from "../components/profile/ProfileIcon";
import {
  SectionCard,
  InfoItem,
  ChipList,
} from "../components/profile/ProfileBlocks";
import ProfileTabs from "../components/profile/ProfileTabs";
import Avatar from "../components/navBar/Avatar";
import { OTP_LENGTH, ROUTES, useCountdown, withEmail } from "@/app/lib/auth";
import { useForgotPasswordMutation, useGetMeQuery } from "@/store/api/authApi";
import { useGetProfileQuery } from "@/store/api/profileApi";
import { safeHref } from "@/resume/lib/format";

const PROFILE_PATH = "/profile";

const containerClass =
  "relative mx-auto w-full max-w-300 px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)]";

/* -------------------------------------------------------------------------- */
/*  Real profile data -> the shape the FieldDropdown cards were designed for    */
/*  (the profile is saved in the same shape as a resume; the cards use shorter  */
/*  key names, so they are translated here in one place)                        */
/* -------------------------------------------------------------------------- */

const toWorkItem = (job) => ({
  id: job.id,
  company: job.companyName,
  jobTitle: job.jobTitle,
  employeeType: job.employeeType,
  location: job.location,
  startDate: job.startDate,
  endDate: job.endDate,
  isCurrent: job.currentlyWorking,
  jobDescription: job.jobDescription,
});

const toEducationItem = (entry) => ({
  id: entry.id,
  institution: entry.institutionName,
  degree: entry.degree,
  fieldOfStudy: entry.fieldOfStudy,
  gpa: entry.gpa,
  startDate: entry.startDate,
  endDate: entry.currentlyStudying ? "" : entry.endDate,
  description: entry.description,
});

const toProjectItem = (project) => ({
  id: project.id,
  projectName: project.projectName,
  projectType: project.projectType,
  role: project.role,
  keyAchievement: project.keyAchievements,
  keyResponsibilities: project.keyResponsibilities,
  technologies: project.technologies,
  projectUrl: project.projectUrl,
  description: project.projectDescription,
});

const toReferenceItem = (reference) => ({
  id: reference.id,
  name: reference.name,
  designation: reference.jobTitle,
  company: reference.company,
  relationship: reference.relationship,
  email: reference.email,
  phone: reference.phone,
});

/** An entry with no text at all (an empty card the user never filled in) is not shown. */
const hasText = (item) =>
  Object.entries(item).some(([key, value]) => key !== "id" && typeof value !== "boolean" && (Array.isArray(value) ? value.length > 0 : String(value ?? "").trim() !== ""));

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                              */
/* -------------------------------------------------------------------------- */

/** A section's items followed by its "Add" button (it opens that section in the editor). */
const FieldList = ({ field, items, addTitle, editTab }) => (
  <div className="space-y-3">
    {items.map((item) => (
      <FieldDropdown key={item.id} field={field} data={item} />
    ))}
    <AddField title={addTitle} href={`/profile/edit?tab=${editTab}`} />
  </div>
);

const linkItem = (label, value, icon) => {
  const href = safeHref(value);
  return { label, value, icon, ...(href && { href, external: true }) };
};

const getContactItems = (info, accountEmail) => {
  const email = info.email || accountEmail;
  return [
    { label: "Email", value: email, icon: "mail", href: email ? `mailto:${email}` : undefined },
    { label: "Phone number", value: info.phone, icon: "phone", href: info.phone ? `tel:${info.phone.replace(/[^\d+]/g, "")}` : undefined },
    { label: "Location", value: info.location, icon: "mapPin" },
    linkItem("Personal website", info.website, "globe"),
    linkItem("LinkedIn", info.linkedin, "linkedin"),
  ];
};

/* -------------------------------------------------------------------------- */
/*  Page states: loading / error / success notice                              */
/* -------------------------------------------------------------------------- */

const ProfileSkeleton = () => (
  <div aria-busy="true" aria-label="Loading profile" className="animate-pulse">
    <div className="h-36 w-full bg-neutral-200 sm:h-52" />
    <div className={containerClass}>
      <div className="-mt-14 flex flex-col items-center gap-4 sm:-mt-16 md:flex-row md:items-end md:gap-6">
        <div className="size-28 shrink-0 rounded-2xl bg-neutral-300 ring-4 ring-neutral-50 sm:size-36" />
        <div className="flex flex-col items-center gap-2 md:items-start md:pb-2">
          <div className="h-7 w-48 rounded bg-neutral-200" />
          <div className="h-4 w-32 rounded bg-neutral-200" />
        </div>
      </div>
      <div className="mt-8 h-64 rounded-xl bg-neutral-200/70" />
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className={`${containerClass} pt-16`}>
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-neutral-500/10"
    >
      <p className="text-body text-red-500">{message}</p>
      <Button type="button" onClick={onRetry}>
        Try again
      </Button>
    </div>
  </div>
);

const SuccessNotice = ({ children, onDismiss }) => (
  <div
    role="status"
    className="flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-small font-medium text-green-700 sm:text-body"
  >
    <span>{children}</span>
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss message"
      className="shrink-0 leading-none text-green-700/70 hover:text-green-700"
    >
      ✕
    </button>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Tab 1: Personal information                                                */
/* -------------------------------------------------------------------------- */

/**
 * Change password = send a reset code to the logged-in user's email, then open
 * the OTP page. The flow comes back here afterwards (?next=/profile).
 */
const SecurityCard = ({ email }) => {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useCountdown();

  const isBusy = isLoading || isRedirecting || cooldown > 0;

  const handleChangePassword = async () => {
    if (isBusy) return;
    setError("");

    try {
      await forgotPassword({ email }).unwrap();
      setIsRedirecting(true);
      router.push(
        `${withEmail(ROUTES.verifyResetOtp, email)}&next=${encodeURIComponent(PROFILE_PATH)}`,
      );
    } catch (err) {
      if (err.retryAfterSeconds) setCooldown(err.retryAfterSeconds);
      setError(
        err.message ?? "Could not send the verification code. Please try again.",
      );
    }
  };

  const label =
    isLoading || isRedirecting
      ? "Sending code..."
      : cooldown > 0
        ? `Try again in ${cooldown}s`
        : "Change password";

  return (
    <SectionCard title="Password" description="Keep your account protected." className="max-w-[426px] max-h-max">
      {/* The password is never shown as a real value, only masked */}
      <div className="flex items-center justify-between gap-3 rounded-lg bg-neutral-500/5 p-3 max-sm:flex-col max-sm:items-start">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-[18px] text-violet-500/80">
            <ProfileIcon name="lock" />
          </span>
          <div className="min-w-0">
            <p className="text-caption text-neutral-400 sm:text-small">
              Password
            </p>
            <p className="text-body font-medium tracking-widest">••••••••</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleChangePassword}
          disabled={isBusy}
          className="inline-flex min-h-11 shrink-0 items-center rounded-md px-2 py-1 text-small font-medium text-red-500 transition-colors hover:bg-red-500/5 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {label}
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-small text-red-500">
          {error}
        </p>
      ) : (
        <p className="mt-3 text-caption text-neutral-400 sm:text-small">
          We’ll email a {OTP_LENGTH}-digit code to{" "}
          <span className="font-medium break-all text-neutral-500">{email}</span>{" "}
          to confirm it’s you.
        </p>
      )}
    </SectionCard>
  );
};

const PersonalInformation = ({ profile, user }) => (
  <div className="flex max-lg:flex-col gap-6 max-h-max">
    <SectionCard title="Contact details" description="How people can reach you.">
      <dl className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {getContactItems(profile.personalInformation, user.email).map((item) => (
          <InfoItem key={item.label} {...item} />
        ))}
      </dl>
    </SectionCard>

    <SecurityCard email={user.email} />
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Tab 2: Professional information                                            */
/* -------------------------------------------------------------------------- */

const ProfessionalInformation = ({ profile }) => {
  const workExperience = profile.workExperience.map(toWorkItem).filter(hasText);
  const education = profile.education.map(toEducationItem).filter(hasText);
  const projects = profile.projects.map(toProjectItem).filter(hasText);
  const references = profile.references.map(toReferenceItem).filter(hasText);
  const languages = profile.languages.filter((entry) => entry.name).map((entry) => (entry.level ? `${entry.name} - ${entry.level}` : entry.name));

  return (
    <div className="space-y-6">
      <SectionCard title="Professional summary">
        {profile.professionalSummary ? (
          <p className="max-w-3xl whitespace-pre-line text-small leading-relaxed text-neutral-700 sm:text-body">
            {profile.professionalSummary}
          </p>
        ) : (
          <AddField title="Add a professional summary" href="/profile/edit?tab=summary" />
        )}
      </SectionCard>

      <SectionCard title="Work experience" count={workExperience.length}>
        <FieldList field="work experience" items={workExperience} addTitle="Add work experience" editTab="experience" />
      </SectionCard>

      <SectionCard title="Education" count={education.length}>
        <FieldList field="education" items={education} addTitle="Add education" editTab="education" />
      </SectionCard>

      <SectionCard title="Projects" count={projects.length}>
        <FieldList field="project" items={projects} addTitle="Add project" editTab="projects" />
      </SectionCard>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <SectionCard title="Skills">
          <ChipList items={profile.skills} emptyText="No skills added yet" />
        </SectionCard>

        <SectionCard title="Languages">
          <ChipList items={languages} emptyText="No languages added yet" />
        </SectionCard>
      </div>

      <SectionCard title="References" count={references.length}>
        <FieldList field="reference" items={references} addTitle="Add reference" editTab="references" />
      </SectionCard>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Loaded profile: cover + header + tabs                                      */
/* -------------------------------------------------------------------------- */

/** The profile photo (Cloudinary), or the account picture / initials when there is none. A plain <img>: the host is not in next.config. */
const ProfilePhoto = ({ user, photoUrl, name }) =>
  photoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photoUrl} alt={`${name} profile photo`} width={144} height={144} className="size-28 rounded-xl object-cover sm:size-36" />
  ) : (
    <Avatar
      user={user}
      alt={`${name} profile photo`}
      width={144}
      height={144}
      sizes="(max-width: 640px) 112px, 144px"
      className="size-28 rounded-xl object-cover sm:size-36"
      priority={true}
    />
  );

const ProfileView = ({ user, profile, notice }) => {
  const router = useRouter();
  const info = profile.personalInformation;
  const name = info.fullName || user.name;

  // Built here (not at module level) because the tabs need the loaded data.
  const tabs = [
    {
      key: "personal",
      label: "Personal information",
      text: "Personal information",
      content: <PersonalInformation profile={profile} user={user} />,
    },
    {
      key: "professional",
      label: "Professional information",
      text: "Professional information",
      content: <ProfessionalInformation profile={profile} />,
    },
  ];

  return (
    <>
      {/* cover */}
      <div className="relative h-36 w-full overflow-hidden sm:h-52">
        <Image
          src="/profileBG.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className={containerClass}>
        {/* header: avatar + name + actions */}
        <header className="-mt-14 flex flex-col items-center gap-4 text-center sm:-mt-16 md:flex-row md:items-end md:gap-6 md:text-left">
          <div className="shrink-0 rounded-2xl bg-white p-1.5 shadow-[0_8px_24px_rgba(16,24,40,0.10)] ring-1 ring-neutral-500/10">
            <ProfilePhoto user={user} photoUrl={info.photo?.url} name={name} />
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-1 md:items-start md:pb-2">
            <h1 className="font-primary text-[22px] leading-tight font-semibold wrap-break-word sm:text-[28px]">
              {name}
            </h1>
            <p className="text-body text-neutral-500">{info.professionalTitle || "Add your professional title"}</p>
          </div>

          <div className="flex items-center gap-3 md:pb-2">
            <Button
              variant="secondary"
              icon={icons.edit}
              onClick={() => router.push("/profile/edit")}
              className="border-violet-100/30 bg-violet-50 text-violet-500 hover:bg-violet-100/40"
            >
              Edit information
            </Button>
            <BTNDropdown />
          </div>
        </header>

        {notice && <div className="mt-6">{notice}</div>}

        <p className="mt-6 flex items-start gap-2 rounded-lg bg-blue-500/5 p-3 text-small text-blue-500">
          <i className={`${icons.information} mt-0.75`} aria-hidden="true"></i>
          <span>This information fills in your next resumes. Changing it never changes resumes you already made.</span>
        </p>

        {/* tabs */}
        <div className="mt-[clamp(1.5rem,calc(1.878vw+1.06rem),2.5rem)]">
          <ProfileTabs tabs={tabs} user={user} />
        </div>
      </div>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const ProfileContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user, isLoading: userLoading, isError, error, refetch } = useGetMeQuery();
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileFailed,
    error: profileError,
    refetch: refetchProfile,
  } = useGetProfileQuery(undefined, { skip: !user });
  const [showUpdated, setShowUpdated] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const isLoggedOut =
    isError && (error?.status === 401 || error?.code === "UNAUTHENTICATED");

  // Not logged in -> login, then come back here
  useEffect(() => {
    if (isLoggedOut) {
      router.replace(`/login?next=${encodeURIComponent(PROFILE_PATH)}`);
    }
  }, [isLoggedOut, router]);

  // Coming back from the change-password flow or from the editor: show a message once, then clean the URL
  useEffect(() => {
    const passwordUpdated = searchParams.get("passwordUpdated") === "1";
    const saved = searchParams.get("saved") === "1";
    if (passwordUpdated || saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (passwordUpdated) setShowUpdated(true);
      if (saved) setShowSaved(true);
      router.replace(PROFILE_PATH, { scroll: false });
    }
  }, [searchParams, router]);

  const notice = (
    <>
      {showUpdated && (
        <SuccessNotice onDismiss={() => setShowUpdated(false)}>Your password has been updated.</SuccessNotice>
      )}
      {showSaved && (
        <SuccessNotice onDismiss={() => setShowSaved(false)}>
          Your profile was saved. New resumes will start with this information.
        </SuccessNotice>
      )}
    </>
  );

  return (
    <main className="min-h-screen min-w-[320px] bg-neutral-50 pb-[clamp(2rem,calc(6.009vw+0.592rem),6rem)]">
      {(userLoading || isLoggedOut || (user && profileLoading)) && <ProfileSkeleton />}

      {isError && !isLoggedOut && (
        <ErrorState
          message={error?.message ?? "Could not load your profile."}
          onRetry={() => refetch()}
        />
      )}

      {user && profileFailed && (
        <ErrorState
          message={profileError?.message ?? "Could not load your profile."}
          onRetry={() => refetchProfile()}
        />
      )}

      {user && profile && <ProfileView user={user} profile={profile} notice={showUpdated || showSaved ? notice : null} />}
    </main>
  );
};

const ProfilePage = () => (
  // useSearchParams needs a Suspense boundary in the App Router
  <Suspense fallback={<ProfileSkeleton />}>
    <ProfileContent />
  </Suspense>
);

export default ProfilePage;
