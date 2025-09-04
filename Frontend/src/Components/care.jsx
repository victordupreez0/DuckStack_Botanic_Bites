import { useState, useEffect } from 'react'
import CareHeader from './careHeader'
import CareGuideRow from './careGuideRow'



function Care() {
  return (
    <div className="min-h-screen">
    <CareHeader />
    <CareGuideRow />
    </div>
  )
}

export default Care;