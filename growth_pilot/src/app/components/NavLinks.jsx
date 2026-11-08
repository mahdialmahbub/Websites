"use client";

import useActiveSection from "../features/ui/useActiveSection";
import NavLink from "./NavLink";

const NavLinks = ({ links }) => {
  const ids = links.map((l) => l.link.replace("#", ""));
  const active = useActiveSection(ids);

  return (
    <div className="flex items-center gap-[12px] text-black dark:text-white max-xl:hidden">
      {links.map(({ text, link }) => (
        <NavLink
          key={link}
          text={text}
          link={`/${link}`}
          isActive={active === link.replace("#", "")}
        />
      ))}
    </div>
  );
};

export default NavLinks;
