import Image from "next/image";
import Link from "next/link";
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
import {
  profile,
  personalInformation,
  professionalSummary,
  workExperience,
  education,
  skills,
  projects,
  languages,
  references,
} from "../../../assets/profileData";
import ProfileTabs from "../components/profile/ProfileTabs";
import FinalPreviewModal from "../components/builder/FinalPreviewModal";

/* -------------------------------------------------------------------------- */
/*  Small helper: ekta section er item list + shesh e "Add" button             */
/* -------------------------------------------------------------------------- */

const FieldList = ({ field, items, addTitle }) => (
  <div className="space-y-3">
    {items.map((item) => (
      <FieldDropdown key={item.id} field={field} data={item} />
    ))}
    <AddField title={addTitle} />
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Tab 1 — Personal information                                               */
/* -------------------------------------------------------------------------- */

const PersonalInformation = () => (
  <div className="grid items-start gap-6 lg:grid-cols-3">
    <SectionCard
      title="Contact details"
      description="How people can reach you."
      className="lg:col-span-2"
    >
      <dl className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {personalInformation.map((item) => (
          <InfoItem key={item.label} {...item} />
        ))}
      </dl>
    </SectionCard>

    <SectionCard title="Security" description="Keep your account protected.">
      {/* Password kokhono real value hishebe dekhano hoy na — shudhu masked */}
      <div className="flex items-center justify-between gap-3 rounded-lg bg-neutral-500/5 p-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-[18px] text-violet-500/80">
            <ProfileIcon name="lock" />
          </span>
          <div className="min-w-0">
            <p className="text-caption sm:text-small text-neutral-400">
              Password
            </p>
            <p className="text-body font-medium tracking-widest">••••••••</p>
          </div>
        </div>
        <Link
          href="/forgot-password"
          className="shrink-0 rounded-md px-2 py-1 text-small sm:text-body font-medium text-red-500 transition-colors hover:bg-red-500/5 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
        >
          Change password
        </Link>
      </div>
    </SectionCard>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Tab 2 — Professional information                                           */
/* -------------------------------------------------------------------------- */

const ProfessionalInformation = () => (
  <div className="space-y-6">
    <SectionCard title="Professional summary">
      <p className="max-w-3xl text-small sm:text-body leading-relaxed text-neutral-700">
        {professionalSummary}
      </p>
    </SectionCard>

    <SectionCard title="Work experience" count={workExperience.length}>
      <FieldList
        field="work experience"
        items={workExperience}
        addTitle="Add work experience"
      />
    </SectionCard>

    <SectionCard title="Education" count={education.length}>
      <FieldList field="education" items={education} addTitle="Add education" />
    </SectionCard>

    <SectionCard title="Projects" count={projects.length}>
      <FieldList field="project" items={projects} addTitle="Add project" />
    </SectionCard>

    <div className="grid items-start gap-6 md:grid-cols-2">
      <SectionCard title="Skills">
        <ChipList items={skills} emptyText="No skills added yet" />
      </SectionCard>

      <SectionCard title="Languages">
        <ChipList items={languages} emptyText="No languages added yet" />
      </SectionCard>
    </div>

    <SectionCard title="References" count={references.length}>
      <FieldList
        field="reference"
        items={references}
        addTitle="Add reference"
      />
    </SectionCard>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const tabs = [
  {
    key: "personal",
    label: "Personal information",
    content: <PersonalInformation />,
  },
  {
    key: "professional",
    label: "Professional information",
    content: <ProfessionalInformation />,
  },
];

const ProfilePage = () => {
  return (
    <main className="min-h-screen min-w-[320px] bg-neutral-50 pb-[clamp(2rem,calc(6.009vw+0.592rem),6rem)]">
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

      <FinalPreviewModal />

      <div className="mx-auto w-full max-w-300 px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)]">
        {/* header: avatar + name + actions */}
        <header className="-mt-14 flex flex-col items-center gap-4 text-center sm:-mt-16 md:flex-row md:items-end md:gap-6 md:text-left">
          <div className="shrink-0 rounded-2xl bg-white p-1.5 shadow-[0_8px_24px_rgba(16,24,40,0.10)] ring-1 ring-neutral-500/10">
            <Image
              src={profile.avatar}
              alt={`${profile.name} profile photo`}
              width={144}
              height={144}
              priority
              sizes="(max-width: 640px) 112px, 144px"
              className="size-28 rounded-xl object-cover sm:size-36"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-1 md:items-start md:pb-2">
            <h1 className="font-primary text-[22px] font-semibold leading-tight wrap-break-word sm:text-[28px]">
              {profile.name}
            </h1>
            <p className="text-body text-neutral-500">{profile.title}</p>
            <p className="flex items-center gap-1.5 text-small text-neutral-400">
              <ProfileIcon name="mapPin" size={14} />
              {profile.location}
            </p>
          </div>

          <div className="flex items-center gap-3 md:pb-2">
            <Button
              variant="secondary"
              icon={icons.edit}
              className="bg-violet-50 text-violet-500 border-violet-100 hover:bg-violet-100"
            >
              Edit information
            </Button>
            <BTNDropdown />
          </div>
        </header>

        {/* tabs */}
        <div className="mt-[clamp(1.5rem,calc(1.878vw+1.06rem),2.5rem)]">
          <ProfileTabs tabs={tabs} />
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
