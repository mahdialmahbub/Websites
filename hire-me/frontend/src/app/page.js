import React from 'react'
import Hero from './components/home/Hero'
import Steps from './components/home/Steps'
import Templetes from './components/home/Templetes'
import Testimonial from './components/home/Testimonial'
import ATSScore from './components/home/ATSScore'
import Contact from './components/home/Contact'
import FinalCTA from './components/home/FinalCTA'

const page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center min-w-[320px] max-w-300 mx-auto *:w-full">
      <Hero />
      <Steps />
      {/* feature section */}
      <Templetes/>
      <Testimonial />
      <Contact />
      <FinalCTA />
    </main>
  )
}

export default page