"use client"

import { usePathname } from 'next/navigation';
import React from 'react'
import DarkToggleBTN from './DarkToggleBTN';
import Button from './Button';
import Link from 'next/link';

const pageTitles = {
  "/": "",
  "/about": "About Me",
  "/workflow": "Workflow",
  "/projects": "Projects",
  "/clients": "Clients",
  "/contact": "Contact",
};

const Navbar = () => {

    const pathname = usePathname();
  // const { theme, setTheme } = useTheme();

  // avoids hydration mismatch: theme is only known client-side
  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  const title = pageTitles[pathname] ?? "";

  const isProjectsPage = pathname === "/projects";
  const buttonHref = isProjectsPage ? "/contact" : "/projects";
  const buttonText = isProjectsPage ? "Contact" : "Projects";

  return (
    <div className='flex items-center justify-between py-space-4 h-[64px]'>
      <p className='font-primary text-size-xl font-semibold opacity-50'>{title}</p>
      <div className='flex items-center gap-space-6'>
        {/* Dark Button */}
        <DarkToggleBTN />
        <Link href={buttonHref} >
          <Button text={buttonText} />
        </Link>
      </div>
    </div>
  )
}

export default Navbar