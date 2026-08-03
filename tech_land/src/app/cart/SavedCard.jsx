import Image from 'next/image'
import React from 'react'
import { assets } from '../assets/assets'

const SavedCard = ({cardName = "masterCard", number = "1234 5678 9012 3456", handleDelete, handleEdit}) => {
  return (
    <div className='flex items-center gap-space-4'>

        {/* Icon */}
        <div className='p-space-1 rounded-[4px]'>
            <Image alt='card logo' src={cardName == "mastercard" ? assets.mastercardLogo : assets.visaCardLogo} />
            <h4 className=''></h4>
        </div>
    </div>
  )
}

export default SavedCard