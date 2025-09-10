import React from 'react'

// Usage: <StatsCard items={[{ Title: 'Total Sales', Metric: 'R2450.00' }, ...]} />
function StatsCard({ items = [], className = '' }) {
  if (!Array.isArray(items) || items.length === 0) return null

  return (
    <div className={`flex flex-row flex-wrap items-start gap-2 ${className}`}>
      {items.map(({ Title, Metric }, idx) => (
        <div
          key={`${Title ?? 'item'}-${idx}`}
          className="card bg-white w-fit rounded-lg border border-gray-300"
        >
          <div className="card-body p-3">
            <h2 className="text-left text-base sm:text-lg font-medium text-black">{Title}</h2>
            <p className="text-left text-2xl sm:text-3xl font-bold text-black">{Metric}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCard;