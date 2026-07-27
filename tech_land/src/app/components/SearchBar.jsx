import React from 'react'

const SearchBar = ({placeholder}) => {
  return (
    <div className='p-space-3 bg-background border-[1.5px] border-secondary/20 rounded-lg flex items-center gap-space-3'>
        <i className="fi fi-br-search text-secondary text-[20px] flex items-center justify-center"></i>
        <input type="text" className='w-full p-0 placeholder:text-placeholder_3' />
        <i className="fi fi-rr-cross-circle text-[20px] flex items-center justify-center text-red"></i>
    </div>
  )
}

export default SearchBar