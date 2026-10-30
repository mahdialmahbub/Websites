import React from 'react'
import ResumeBTN from '../ResumeBTN'


const Hero = () => {
  return (
    <section className='flex gap-space-7 items-center'>
      
      {/* left side */}
      <div className='space-y-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)] flex flex-col max-md:items-center px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(2rem,calc(3.38vw+1.208rem),4.25rem)]'>
        <div className='space-y-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)] max-md:text-center md:leading-20'>
          <h1 className='text-[clamp(1.875rem,calc(3.192vw+1.127rem),4rem)] font-primary font-semibold'>Build a Job-Ready Resume With AI</h1>
          <p className='text-[clamp(0.875rem,calc(0.563vw+0.743rem),1.25rem)] leading-6 sm:leading-8 text-neutral-500'>Create a professional, ATS-friendly resume and get AI-powered help to improve your content, match your resume to a job description, and choose a template that fits your target role.</p>
        </div>
        <ResumeBTN href={"/create-resume"}/>
        <div>

        </div>
      </div>
    </section>
  )
}

export default Hero