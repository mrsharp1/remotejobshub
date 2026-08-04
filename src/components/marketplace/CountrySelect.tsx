import React, { useState, useRef, useEffect } from 'react'
import { Globe, X, Check, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { springs } from '@/lib/framer-physics'

const POPULAR_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Ireland',
  'Nigeria',
  'South Africa',
  'Kenya',
  'Ghana',
  'India',
  'Pakistan',
  'Philippines',
  'Brazil',
  'Mexico',
  'United Arab Emirates',
]

const ALL_COUNTRIES = [
  ...POPULAR_COUNTRIES,
  'Argentina', 'Bangladesh', 'Belgium', 'Chile', 'Colombia', 'Denmark', 'Egypt',
  'Finland', 'Greece', 'Indonesia', 'Japan', 'Malaysia', 'New Zealand',
  'Norway', 'Peru', 'Poland', 'Portugal', 'Saudi Arabia', 'Singapore',
  'South Korea', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Vietnam',
].sort()

const UNIQUE_ALL_COUNTRIES = Array.from(new Set(ALL_COUNTRIES)).sort()

interface CountrySelectProps {
  value: string
  onChange: (val: string) => void
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filteredCountries = UNIQUE_ALL_COUNTRIES.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isSearching = searchQuery.length > 0
  
  const displayItems = isSearching
    ? filteredCountries
    : [
        { type: 'header', label: 'Popular Countries' },
        ...POPULAR_COUNTRIES,
        { type: 'header', label: 'All Countries' },
        ...UNIQUE_ALL_COUNTRIES.filter(c => !POPULAR_COUNTRIES.includes(c)),
      ]
      
  const selectableItems = displayItems.filter(i => typeof i === 'string') as string[]

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchQuery('')
      return
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        return
      }
      setHighlightedIndex((prev) => 
        prev < selectableItems.length - 1 ? prev + 1 : prev
      )
    }
    
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    }
    
    if (e.key === 'Enter') {
      e.preventDefault()
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < selectableItems.length) {
        handleSelect(selectableItems[highlightedIndex])
      } else if (!isOpen) {
        setIsOpen(true)
      }
    }
  }

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeItemStr = selectableItems[highlightedIndex]
      const items = Array.from(listRef.current.children)
      const activeEl = items.find(el => el.getAttribute('data-value') === activeItemStr) as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex, selectableItems])

  const handleSelect = (country: string) => {
    onChange(country)
    setIsOpen(false)
    setSearchQuery('')
    setHighlightedIndex(-1)
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className="group relative flex cursor-text items-center"
        onClick={() => {
          setIsOpen(true)
          inputRef.current?.focus()
        }}
      >
        <Globe className="absolute left-5 z-10 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-400" />
        
        {value && !isOpen && (
          <div className="absolute left-14 right-12 z-10 flex h-full items-center">
            <span className="truncate font-medium text-white">{value}</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : ''}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsOpen(true)
            setHighlightedIndex(0)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={value && !isOpen ? '' : 'Any Country'}
          className="h-14 w-full rounded-2xl border border-transparent bg-slate-950/50 py-3 pl-14 pr-12 text-base font-medium text-white transition-all placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
        />

        <div className="absolute right-3 z-10 flex items-center gap-1">
          {value && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
                setSearchQuery('')
                inputRef.current?.focus()
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label="Clear country"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {!value && (
            <ChevronDown className="pointer-events-none h-4 w-4 text-slate-500" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={springs.gentle}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl"
          >
            <ul 
              ref={listRef}
              className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 pr-2"
            >
              {displayItems.length === 0 ? (
                <li className="py-8 text-center text-sm font-medium text-slate-500">
                  No countries found matching "{searchQuery}"
                </li>
              ) : (
                displayItems.map((item) => {
                  if (typeof item === 'object') {
                    return (
                      <li
                        key={`header-${item.label}`}
                        className="px-3 pb-2 pt-4 text-[10px] font-black uppercase tracking-widest text-slate-500 first:pt-2"
                      >
                        {item.label}
                      </li>
                    )
                  }

                  const isHighlighted = selectableItems[highlightedIndex] === item
                  const isSelected = value === item

                  return (
                    <li
                      key={item}
                      data-value={item}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => {
                        const idx = selectableItems.indexOf(item)
                        if (idx !== -1) setHighlightedIndex(idx)
                      }}
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isHighlighted
                          ? 'bg-blue-500/10 text-blue-400'
                          : isSelected
                          ? 'bg-white/5 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item}
                      {isSelected && <Check className="h-4 w-4 text-blue-400" />}
                    </li>
                  )
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
