import React, { useState, useEffect } from 'react'

export interface ResponsiveTableWrapperProps {
  children: React.ReactNode
  className?: string
}

export const ResponsiveTableWrapper: React.FC<ResponsiveTableWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  const [showLeftShadow, setShowLeftShadow] = useState(false)
  const [showRightShadow, setShowRightShadow] = useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
      setShowLeftShadow(scrollLeft > 0)
      setShowRightShadow(Math.ceil(scrollLeft + clientWidth) < scrollWidth)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  return (
    <div className={`relative w-full rounded-xl border border-border bg-card shadow-sm ${className}`}>
      {/* Left Shadow Indicator */}
      <div 
        className={`pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-background to-transparent transition-opacity duration-300 ${
          showLeftShadow ? 'opacity-100' : 'opacity-0'
        }`} 
      />
      
      {/* Right Shadow Indicator */}
      <div 
        className={`pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-background to-transparent transition-opacity duration-300 ${
          showRightShadow ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      <div 
        ref={containerRef}
        onScroll={checkScroll}
        className="w-full overflow-x-auto scrollbar-hide rounded-xl"
      >
        <div className="min-w-[800px] w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
