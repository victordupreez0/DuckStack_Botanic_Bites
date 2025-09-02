import { useState, useEffect } from 'react'
import Header from './header'
import FeaturedProducts from './featuredProducts'

function Home() {
  return (
    <div className="bg-[#343434] min-h-screen">
      <Header />
      <FeaturedProducts />
    </div>
  )
}

export default Home