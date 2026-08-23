"use client"

import { bannerImages } from '@/app/assets/assets'
import { useGetProductsQuery } from '@/redux'
import Image from 'next/image'
import React from 'react'

const Hero = () => {

  return (
    <section className='section'>
      <Image width={1000} height={1000} src={bannerImages[2]} alt='Hero Banner' className='w-full h-75 rounded-[20px] overflow-hidden' />
        
    </section>
  )
}

export default Hero