import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

// Compact month toggle with icon arrows
// Props: monthLabel?: string, onPrev?: () => void, onNext?: () => void, className?: string
function MonthToggle({ monthLabel = 'September', onPrev, onNext, className = '' }) {
    return (
        <div className={`inline-flex items-center gap-1 w-fit bg-gray-200 rounded-full p-1 text-black ${className}`}>
            <button
                type="button"
                aria-label="Previous month"
                title="Previous month"
                onClick={onPrev}
                className="btn btn-ghost btn-sm rounded-full hover:bg-black hover:text-white min-h-0 h-8 px-2"
            >
                <FiChevronLeft size={16} />
            </button>
            <button
                type="button"
                className="btn btn-sm rounded-full bg-white text-black hover:bg-black hover:text-white min-h-0 h-8 px-3"
                disabled
            >
                {monthLabel}
            </button>
            <button
                type="button"
                aria-label="Next month"
                title="Next month"
                onClick={onNext}
                className="btn btn-ghost btn-sm rounded-full hover:bg-black hover:text-white min-h-0 h-8 px-2"
            >
                <FiChevronRight size={16} />
            </button>
        </div>
    )
}

export default MonthToggle;