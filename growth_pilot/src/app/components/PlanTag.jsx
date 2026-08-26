import React from 'react'

const PlanTag = ({tagName, className}) => {
  return (
    <label className={`${className} text-nowrap text-white text-small md:text-medium font-semibold py-[8px] px-[16px] rounded-full flex items-center justify-center`}>
      {tagName}
    </label>
  )
}

export default PlanTag