import React from 'react'

const FeatureTag = ({text}) => {
  return (
    <div className='flex items-center gap-space-2 px-space-3 py-space-2 rounded-md bg-secondary/5 hover:bg-secondary/10 font-medium text-size-large text-secondary'>
        {text}
        <i className="fi fi-rr-cross-small text-size-large text-red"></i>
    </div>
  )
}

export default FeatureTag