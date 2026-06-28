import React from 'react'
import Count from './Count'
import { counterItems } from '@/app/assets/assets'

const Counter = () => {
  return (
    <section className='px-space-9'>
        <div className='flex items-center justify-between'>
            {counterItems.map((item, index) => (
                <Count key={index} value={item.value} label={item.label} />
            ))}
        </div>
    </section>
  )
}

export default Counter