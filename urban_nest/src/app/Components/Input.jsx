import React from 'react'

const Input = ({icon = 'fi fi-rs-home', label, placeholder, className, type}) => {
  return (
    <div className={`${className}`}>
        <label htmlFor="input" className='flex items-center gap-space-1 text-placeholder '>
            <i className={`${icon} text-[12px] flex itemce justify-center`}></i>
            <p className='font-primary font-semibold text-lg'>{label}</p>
        </label>
        <input type={type} placeholder={placeholder} className='w-full' />
    </div>
  )
}

export default Input