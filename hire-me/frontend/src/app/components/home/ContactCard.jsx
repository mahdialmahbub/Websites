"use client";

import { useState } from "react";
import Image from "next/image";
import { Rouge_Script } from "next/font/google";
import { teamInfo } from "../../../../assets/assets";
import { icons } from "../../../../assets/iconCollection";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const signatureFont = Rouge_Script({
  subsets: ["latin"],
  weight: ["400"],
});

// Shown whenever the matching prop is missing or empty.
const PLACEHOLDER = {
  image: teamInfo[0].image,
  name: "John Doe",
  role: "UI UX Designer",
  phone: "+1 (415) 555-0147",
  email: "alex.demo01@example.com",
  address: "245 Market Street, San Francisco, CA, USA.",
};

// Default socials. Each entry can only have two keys: `name` and `link`.
const DEFAULT_SOCIALS = [
  { name: "LinkedIn", link: "https://www.linkedin.com" },
  { name: "Facebook", link: "https://www.facebook.com" },
];

// Social `name` -> icon. A name that isn't listed here is skipped.
const SOCIAL_ICONS = {
  Facebook: icons.facebook_blue,
  Twitter: icons.twitter_blue,
  Instagram: icons.instagram_blue,
  LinkedIn: icons.linkedin_blue,
  WhatsApp: icons.whatsapp_blue,
};
const SOCIAL_NAMES = Object.keys(SOCIAL_ICONS);

// Shared by the contact-row icons and the social buttons.
const ICON_BOX =
  "flex items-center justify-center rounded-sm border border-neutral-800 bg-[#111722]/30 text-blue-500";

const ROW_ICON = `${ICON_BOX} size-[clamp(1.375rem,calc(0.376vw+1.287rem),1.625rem)] text-[clamp(0.5625rem,calc(0.282vw+0.497rem),0.75rem)]`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const HTTP_URL = /^https?:\/\//i;

// Keeps ONLY { name, link }. Extra keys are dropped, and entries are skipped
// when the name has no icon in SOCIAL_ICONS or the link isn't an http(s) URL.
const sanitizeSocials = (list) => {
  if (!Array.isArray(list)) return [];

  return list
    .map((item) => ({
      name: typeof item?.name === "string" ? item.name.trim() : "",
      link: typeof item?.link === "string" ? item.link.trim() : "",
    }))
    .filter(
      ({ name, link }) => SOCIAL_NAMES.includes(name) && HTTP_URL.test(link),
    );
};

// "+1 (415) 555-0147" -> "tel:+14155550147"
const toTelHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, "")}`;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const ContactRow = ({ icon, label, children }) => (
  <div className="flex gap-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)]">
    <span aria-hidden="true" className={ROW_ICON}>
      <i className={`fi ${icon}`} />
    </span>

    <div className="space-y-space-1">
      <p className="font-primary text-[10px] text-blue-500">{label}</p>
      <p className="text-[12px] font-medium text-neutral-50">{children}</p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Team-member card: photo, name and role, with a toggleable contact panel.
 *
 * @param {object} props
 * @param {import("next/image").StaticImageData | string} [props.image]
 * @param {string} [props.name]
 * @param {string} [props.role]
 * @param {string} [props.phone]
 * @param {string} [props.email]
 * @param {string} [props.address]
 * @param {{ name: string, link: string }[]} [props.socials] Defaults to DEFAULT_SOCIALS.
 * @param {"h2" | "h3" | "h4" | "h5" | "h6"} [props.headingAs="h3"] Heading tag used for the name.
 */
const ContactCard = ({
  image,
  name,
  role,
  phone,
  email,
  address,
  socials = DEFAULT_SOCIALS,
  headingAs: Heading = "h3",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const person = {
    image: image || PLACEHOLDER.image,
    name: name || PLACEHOLDER.name,
    role: role || PLACEHOLDER.role,
    phone: phone || PLACEHOLDER.phone,
    email: email || PLACEHOLDER.email,
    address: address || PLACEHOLDER.address,
  };
  const safeSocials = sanitizeSocials(socials);

  return (
    <article
      className={[
        "relative isolate overflow-hidden rounded-md border border-blue-500/60",
        "w-[clamp(14.375rem,calc(1.878vw+13.935rem),15.625rem)]",
        "h-[clamp(16.875rem,calc(2.817vw+16.215rem),18.75rem)]",
        "shadow-[1px_1px_6px_rgb(2_132_199/0.25)]",
      ].join(" ")}
    >
      {/* Photo + overlay (the overlay is stronger while the details are open) */}
      <Image
        src={person.image}
        alt={`Portrait of ${person.name}`}
        fill
        sizes="250px"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${
          isOpen
            ? "bg-neutral-950/80"
            : "bg-linear-to-t from-neutral-950 to-transparent"
        }`}
      />

      {/* Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={`Contact details for ${person.name}`}
        className={[
          "absolute top-2.5 right-2.5 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors",
          "text-[clamp(1rem,calc(0.376vw+0.912rem),1.25rem)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
          isOpen
            ? "text-red-500/80 hover:bg-red-500/10 hover:text-red-500"
            : "bg-blue-900 text-blue-500 hover:bg-blue-800",
        ].join(" ")}
      >
        <i
          aria-hidden="true"
          className={isOpen ? "fi fi-rr-cross-small" : "fi fi-rr-info"}
        />
      </button>

      {/* Front: name + role */}
      <div
        hidden={isOpen}
        className="relative flex h-full flex-col items-center justify-end gap-space-1 pb-space-4 text-neutral-50"
      >
        <Heading
          className={`${signatureFont.className} text-[clamp(1.75rem,calc(0.751vw+1.574rem),2.25rem)]`}
        >
          {person.name}
        </Heading>
        <p className="font-primary text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)]">
          {person.role}
        </p>
      </div>

      {/* Back: contact details (always in the DOM, just hidden) */}
      <address
        hidden={!isOpen}
        className={[
          "relative flex h-full flex-col justify-center not-italic",
          "gap-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)] px-space-4 pb-4",
        ].join(" ")}
      >
        <ContactRow icon="fi-rr-phone-flip" label="Phone">
          <a href={toTelHref(person.phone)} className="hover:underline">
            {person.phone}
          </a>
        </ContactRow>

        <ContactRow icon="fi-rr-envelope" label="Email">
          <a href={`mailto:${person.email}`} className="hover:underline">
            {person.email}
          </a>
        </ContactRow>

        <ContactRow icon="fi-rr-marker" label="Address">
          {person.address}
        </ContactRow>

        {safeSocials.length > 0 && (
          <ul className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-[clamp(0.625rem,calc(0.188vw+0.581rem),0.75rem)]">
            {safeSocials.map(({ name: platform, link }) => (
              <li key={`${platform}-${link}`}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${person.name} on ${platform}`}
                  className={`${ICON_BOX} size-8.5`}
                >
                  <Image src={SOCIAL_ICONS[platform]} alt="" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </address>
    </article>
  );
};

export default ContactCard;
