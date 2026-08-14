import Button from '@/app/components/Button'
import React from 'react'

const page = () => {
  return (
    <div className='min-h-full min-w-full flex items-center justify-center'>
        <Button showLeftIcon leftIcon='fi fi-rr-arrow-small-left' variant='text' className='top' >
            Back to Home
        </Button>
    </div>
  )
}

export default page