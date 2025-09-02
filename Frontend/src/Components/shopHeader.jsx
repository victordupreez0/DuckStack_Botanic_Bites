import { useState, useEffect } from 'react'
import Header from './header'
import FeaturedProducts from './featuredProducts'

function ShopHeader() {
  return (
    <div className="relative w-full flex flex-col items-center h-[35vh] bg-black bg-cover bg-center">
        <div className="mt-10 md:mt-20">
        <h2 className="text-[50px] md:text-[60px] font-bold">Shop our carnivorous range</h2>
        </div>
    </div>
  )
}

export default ShopHeader;