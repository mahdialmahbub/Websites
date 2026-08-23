import React from 'react'

const SectionTag = ({text = 'Text'}) => {
  return (
    <div className='py-[8px] xl:py-[12px] px-[16px] md:py-[20px] rounded-full text-medium md:text-h6 xl:text-h5 font-bold text-secondary2 bg-linear-to-tr from-secondary/10 to-secondary2/10 border border-secondary2 w-max'>{text}</div>
  )
}

export default SectionTag