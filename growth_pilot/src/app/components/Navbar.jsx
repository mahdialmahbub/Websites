import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";
import DarkToggle from "./DarkToggle";
import Button from "./Button";
import FadeDown from "./motions/FadeDown";
import MobileMenu, { MobileMenuButton } from "./MobileMenu";

const NAV_LINKS = [
  { text: "Home", link: "/" },
  { text: "Features", link: "#feature" },
  { text: "Pricing", link: "#pricing" },
  { text: "Customer", link: "#customer" },
];

// TODO: replace the "#" placeholders with your real profile URLs
const SOCIAL_LINKS = [
  { name: "facebook", href: "#" },
  { name: "twitter", href: "#" },
  { name: "instagram", href: "#" },
  { name: "youtube", href: "#" },
  { name: "gmail", href: "#" },
];

const LOGO_SIZE =
  "h-[clamp(1.75rem,1.4773rem+1.3636vw,2.5rem)] w-auto object-contain";

const Navbar = () => {
  return (
    // Sticky wrapper: keeps the navbar and the mobile menu panel together
    <div className="top-[8px] md:top-[12px] w-full sticky z-40 mt-[16px] md:mt-7.5">
      <FadeDown
        as="nav"
        className="relative z-10 w-full py-[12px] px-[16px] md:py-[12px] md:px-[32px] xl:py-[16px] xl:px-20 rounded-full bg-[#f8fafc]/80 dark:bg-[#080b10]/80 border border-black/10 dark:border-white/10 flex items-center justify-between backdrop-blur-[30px]"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="GrowthPilot home"
          className="inline-flex shrink-0 items-center"
        >
          <Image
            src="/growthpilot-logo-black.svg"
            width={150}
            height={40}
            alt="GrowthPilot"
            priority
            className={`${LOGO_SIZE} dark:hidden`}
          />

          <Image
            src="/growthpilot-logo-white.svg"
            width={150}
            height={40}
            alt="GrowthPilot"
            priority
            className={`${LOGO_SIZE} hidden dark:block`}
          />
        </Link>

        {/* Nav links (desktop) */}
        <div className="flex items-center gap-[12px] text-black dark:text-white max-xl:hidden">
          {NAV_LINKS.map(({ text, link }) => (
            <NavLink key={link} text={text} link={link} />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-[clamp(0.5rem,0.3182rem+0.9091vw,1rem)]">
          <DarkToggle />
          <MobileMenuButton />
          <Button variant="secondary" className="max-xl:hidden" text="Login" />
        </div>
      </FadeDown>

      {/* Mobile menu (panel + backdrop) */}
      <MobileMenu links={NAV_LINKS} socials={SOCIAL_LINKS} />
    </div>
  );
};

export default Navbar;
