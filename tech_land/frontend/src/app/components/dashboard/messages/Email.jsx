"use client"

import React from 'react'

const Email = ({email}) => {

      const handleOpenGmail = () => {
    // Gmail e giye ei address theke/e asha shob mail search kore dekhabe
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <button onClick={handleOpenGmail} className='font-medium text-size-h6 text-secondary cursor-pointer'>{email}</button>
  )
}

export default Email