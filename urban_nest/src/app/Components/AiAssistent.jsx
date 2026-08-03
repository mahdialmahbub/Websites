import Image from 'next/image'
import React from 'react'
import { assets } from '../assets/assets'
import TextButton from './TextButton'

const AiAssistent = () => {
  return (
    <section className='p-space-9 gap-space-7 flex items-center w-[1440px] container mx-auto'>
        <Image alt='image' className='object-cover w-[525px] h-[350px]' src={assets.Aiassistent} />
        <div className=''>
            <div className=''>
                <h2 className='font-primary text-[32px] font-semibold mb-space-3'>Meet Your Personal AI Real Estate Assistant</h2>
                <p className='text-3xl text-placeholder'>Ask questions, discover properties, and receive intelligent recommendations tailored to your goals in seconds.</p>
            </div>
            <TextButton className='mt-space-5' text={'Explore Now'} />
        </div>
    </section>
  )
}

export default AiAssistent