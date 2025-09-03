import { useState, useEffect } from 'react'
import ShopHeader from './shopHeader'
import FilterRow from './filterRow'
import ShopBody from './shopBody'


import FeaturedProducts from './featuredProducts'
import ShopProductCard from '../UI/shopProductCard'

function Shop() {
  return (
    <div className="min-h-screen">
    <ShopHeader />
    <FilterRow />
    <ShopBody />
    </div>
  )
}

export default Shop;