import React, { useState } from "react";
import StatsCard from './statsCard'
import MonthToggle from './monthToggle'

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  const handlePrev = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  const handleNext = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  const monthLabel = `${currentDate.toLocaleString('en-US', { month: 'long' })} ${currentDate.getFullYear()}`

  const items = [
    { Title: 'Total Sales', Metric: 'R2450.00' },
    { Title: 'Total Orders', Metric: '18' },
    { Title: 'New Users', Metric: '11' },
  ]

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl text-left font-bold text-black">Dashboard</h2>
          <MonthToggle monthLabel={monthLabel} onPrev={handlePrev} onNext={handleNext} />
        </div>
        <p className="text-xl mb-4 text-black text-left">Welcome to the admin dashboard. Here you can manage products, orders, and users.</p>
      </div>
      <div>
        <StatsCard items={items} />
      </div>
    </>
  )
}

export default Dashboard;
