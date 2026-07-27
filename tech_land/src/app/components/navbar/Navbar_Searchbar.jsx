import React from 'react'

const Navbar_Searchbar = () => {
  return (
    <div className='bg-background border-[1.5px] border-secondary/10 h-[48px] flex items-center gap-2.5 rounded-[8px] overflow-hidden w-[600px]'>
        {/* category select */}
        <div className='flex items-center'>
            <div className='flex items-center justify-center px-3 gap-0.5'>
                <label htmlFor="select" className='font-primary text-md text-placeholder_2'>All</label>
                <i className="fi fi-rr-caret-down flex items-center justify-center text-[14px]" ></i>
            </div>
            {/* strock */}
            <div  className='w-0.5 h-6 bg-placeholder_2/30'/>
        </div>
        <input type="text" placeholder='Find your next favorite tech...' className='w-full p-0 text-size-h6 text-foreground placeholder:text-placeholder_3 font-medium outline-none' />
        <i className="fi fi-rr-cross-circle flex items-center justify-center text-red text-[18px] mr-space-[6px]"></i>
        <button className='py-space-3 px-space-4 h-full bg-secondary text-background'>
            <i className="fi fi-br-search"></i>
        </button>
    </div>
  )
}

export default Navbar_Searchbar