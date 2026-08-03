import React from 'react'
import SectionHeader from '../SectionHeader'
import PropertyCard from '../PropertyCard'
import { properties } from '@/app/assets/assets'

const FeaturedProperty = () => {
  return (
    <section className='py-space-9 overflow-hidden w-[1440px] mx-auto'>
        <div>
            <SectionHeader mainText={"Property"} text={"Featured"} />
            <div className='flex gap-space-5 mt-space-7 overflow-x-scroll scrollBar'>
              {properties.map((item) => (
                <PropertyCard key={item.id} property={item} isProgress />
              ))}
                
            </div>
        </div>
    </section>
  )
}

export default FeaturedProperty