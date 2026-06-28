"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from "next/navigation";

const Navlink = ({ item, index }) => {

    const pathname = usePathname();

  return (
    <div className='px-space-3 py-space-2'>
        <Link key={index} href={item.link} className={`font-medium font-primary ${
          pathname === item.link
            ? "text-primary-7 "
            : "text-foreground"
        }`}>{item.name}</Link>
    </div>
  )
}

export default Navlink