'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const NavLink = ({text = 'Text', link = "/"}) => {

  const path = usePathname()

  return (
    <Link href={link} className={`flex items-center justify-center py-[4px] px-[12px] rounded-full text-large md:text-h5 font-semibold hover:bg-linear-to-tr hover:from-secondary/10 hover:to-secondary2/10 hover:text-secondary2/90 w-max  ${path == link ? "text-secondary2" : "text-black dark:text-white"}`}>{text}</Link>
  ) 
}

export default NavLink