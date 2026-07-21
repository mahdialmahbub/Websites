import React from 'react'
import SectionHeader from '../SectionHeader'
import PropertyCard from '../PropertyCard'
import { properties } from '@/app/assets/assets'

const FeaturedProperty = () => {
  return (
    <section className='p-space-9 overflow-hidden'>
        <div>
            <SectionHeader mainText={"Property"} text={"Featured"} />
            <div className='flex gap-space-5 mt-space-7'>
              {properties.map((item) => (
                <PropertyCard key={item.id} property={item} isProgress />
              ))}
                
            </div>
        </div>
    </section>
  )
}

export default FeaturedProperty