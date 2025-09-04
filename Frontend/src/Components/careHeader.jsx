import { useState, useEffect } from 'react'


function CareHeader() {
  return (
    <div className="relative w-full flex flex-col items-center h-[150px] md:h-[300px] bg-black bg-cover bg-center">
        <div className="mt-10 md:mt-20">
        <h2 className="text-[50px] md:text-[60px] font-bold">Care Guides</h2>
        </div>
    </div>
  )
}

export default CareHeader;