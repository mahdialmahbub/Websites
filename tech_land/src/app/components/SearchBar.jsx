'use client'

import React, { useState } from 'react'

const SearchBar = ({placeholder}) => {
  const [value, setValue] = useState('')

  return (
    <div className='p-space-3 bg-background border-[1.5px] border-secondary/20 rounded-lg flex items-center gap-space-3 w-[400px]'>
        <i className="fi fi-br-search text-secondary text-[20px] flex items-center justify-center"></i>
        <input 
          type="text" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='w-full p-0 placeholder:text-placeholder_3 outline-none' 
          placeholder={placeholder || "Search for anything tech..."}
        />

        {/* cross icon - only show when there's text */}
        {value && (
          <i 
            className="fi fi-rr-cross-circle text-[20px] flex items-center justify-center text-red cursor-pointer"
            onClick={() => setValue('')}
          ></i>
        )}
    </div>
  )
}

export default SearchBar