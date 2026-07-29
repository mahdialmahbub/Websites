import React from 'react'

const Status = ({status}) => {
  return (
    <div className={`flex items-center gap-space-1 px-space-3 py-space-2 rounded-[8px] ${status == "pending" && "bg-[#FCE486]/10 text-[#FCE486]"} ${status == "shipping" && "bg-[#6366F1]/10 text-[#6366F1]"} ${status == "completed" && "bg-green/10 text-green"} ${status == "canceled" && "bg-red/10 text-red"}`}>
        {/* switch (key) {
            case value:
                <p></p>
                
                break;
        
            default:
                break;
        } */}
    </div>
  )
}

export default Status