'use client'

import React, { useState } from 'react'

const FaqAccordion = ({
  ques = "How do I book a car?",
  ans = "You can book a car directly from our website. Just choose your location, dates, and select a car that fits your needs — then follow the checkout steps to confirm your booking.",
}) => {

  const[isOpen, setIsOpen] = useState()

  return (
    <div className='px-space-6 py-space-4 rounded-[12px] bg-secondary/5 border-2 border-secondary/30 w-full max-w-[800px] relative overflow-hidden'>

      {/* Left */}

      {isOpen && <div className='absolute w-2 inset-0 bg-secondary transition-all duration-300'>

      </div>}

      {/* ques and toggle Button */}
      <div className='flex items-center justify-between'>
        <h6 className='font-medium text-size-h5 text-foreground w-full'>{ques}</h6>
        <i onClick={() => setIsOpen(!isOpen)} className={`fi fi-rr-caret-down ${isOpen && "-rotate-180"} text-size-h3 hover:text-secondary transition-all duration-100`}></i>
      </div>
            {/* ans Button */}
      <p className={`text-size-h6 text-placeholder mt-space-4 ${!isOpen && 'hidden'} transition-all duration-100`}>
        {ans}
      </p>

    </div>
  )
}

export default FaqAccordion