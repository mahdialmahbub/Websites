import Image from 'next/image'
import React from 'react'
import StarRating from './StarRating'

const FeedbackCard = ({client}) => {

    const {image, name, position, feedback} = client

  return (
    <div className='p-space-6 border-2 border-secondary-500/30 dark:border-secondary-500/20 rounded-2xl space-y-space-6 w-[70%]'>
        <p className='font-medium leading-4.5 text-size-base'>{feedback.comment}</p>
        <div className='border-t-2 border-placeholder/20 pt-space-4 flex items-center justify-between'>
        <div className='flex items-center gap-space-3'>
            {/* image */}
            <Image alt='client' src={image} width={42} height={42} className='rounded-full object-cover' />
            <div className=''>
                <div className='flex items-center gap-0.5 cursor-pointer group'>
                    <h4 className='font-primary font-semibold text-size-xs_2 '>{name}</h4>
                    <i className="fi fi-rr-arrow-small-right text-size-md transition-all duration-200 group-hover:translate-x-1"></i>
                </div>
                <p className='font-medium text-[11px] opacity-70'>{position}</p>
            </div>
        </div><StarRating size={18} rating={feedback.rating} />
        </div>
    </div>
  )
}

export default FeedbackCard