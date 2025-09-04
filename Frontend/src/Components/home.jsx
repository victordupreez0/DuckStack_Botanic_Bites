import { useState, useEffect } from 'react'
import Header from './header'
import FeaturedProducts from './featuredProducts'
import CarePromo from './carePromo'

function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <FeaturedProducts />
      <CarePromo />
    </div>
  )
}

export default Home