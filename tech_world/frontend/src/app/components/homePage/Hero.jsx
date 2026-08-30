"use client"

import { bannerImages } from '@/app/assets/assets'
import { useGetProductsQuery } from '@/redux'
import Image from 'next/image'
import React from 'react'
import MarketingCarousel from '../MarketingCarousel'

const Hero = () => {

  return (
    <section className='section'>
      <MarketingCarousel />
        
    </section>
  )
}

export default Hero