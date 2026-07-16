import Image from 'next/image'
import React from 'react'
import Button from './Button'
import { assets } from '../assets/assets'

const AiAssistent = () => {
  return (
    <section className='p-space-9 gap-space-7 flex items-center'>
        <Image alt='image' className='object-cover w-[525px] h-[350px]' src={assets.Aiassistent} />
        <div className=''>
            <div className=''>
                <h2 className='font-primary text-[32px] font-semibold mb-space-3'>Meet Your Personal AI Real Estate Assistant</h2>
                <p className='text-3xl text-placeholder'>Ask questions, discover properties, and receive intelligent recommendations tailored to your goals in seconds.</p>
            </div>
            <Button className='mt-space-5' text={'Explore Now'} />
        </div>
    </section>
  )
}

export default AiAssistent