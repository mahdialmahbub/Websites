import React from 'react'
import BudgetSelector from './BudgetSelector'

const Form = () => {

    const budgets = [

    ]

  return (
    <form className='flex-1 space-y-space-7'>
        {/* name and email */}
        <div className='flex gap-space-5'>
            <div>
                <label htmlFor="name" className='inputLabel'>Name</label>
                <input id='name' className='mt-space-2' type="text" placeholder='John Doe' />
            </div>
            <div>
                <label htmlFor="email" className='inputLabel'>Email</label>
                <input id='email' className='mt-space-2' type="text" placeholder='youremail@gmail.com' />
            </div>
        </div>
        <div>
            <label htmlFor="budget" className='inputLabel'>Budget</label>
            <div className='w-full flex flex-wrap gap-[18px]'>
                <BudgetSelector />
            </div>
        </div>
        <div>
                <label htmlFor="project" className='inputLabel'>Project Details</label>
                <textarea id='project' className='mt-space-2' type="text" placeholder='I want a saas website...' />
            </div>

    </form>
  )
}

export default Form