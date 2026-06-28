import React from 'react'
import { navbarItems } from '../../assets/assets'
import Link from 'next/link'
import Image from 'next/image'
import Navlink from './Navlink'
import Button from '../Button'

const NavBar = () => {
  return (
    <nav className='px-space-7 py-space-3 flex items-center justify-between bg-primary-1 shadow'>
        {/* Logo */}
        <Image className='h-full w-auto' src={navbarItems.logo} alt='Logo' />

        {/* navLinks */}
        <div className='flex items-center gap-space-3'>
            {navbarItems.navLinks.map((item, index) => (
                <Navlink key={index} item={item} index={index} />
            ))}
        </div>

        {/* Buttons */}
        <div className='flex items-center gap-space-3'>
            <Button text={navbarItems.buttons.primary} type={"primary"}/>
                
            
        </div>
    </nav>
  )
}

export default NavBar