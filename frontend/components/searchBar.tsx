'use client'

import { useEffect, useRef, useState } from 'react'

type Props<T> = {
  fetcher: (query: string) => Promise<T[]>
  getOptionLabel: (item: T) => string
  getOptionValue: (item: T) => string
  onSelect: (item: T) => void
  placeholder?: string
  debounce?: number
}

export function SearchAutocomplete<T>({
  fetcher,
  getOptionLabel,
  getOptionValue,
  onSelect,
  placeholder = 'Search...',
  debounce = 400,
}: Props<T>) {

  /** 🔑 แยก state ชัดเจน */
  const [searchValue, setSearchValue] = useState('')   // ใช้ยิง API
  const [displayValue, setDisplayValue] = useState('') // ใช้แสดงใน input

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!searchValue.trim()) {
      setData([])
      setOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetcher(searchValue)
        setData(Array.isArray(res) ? res : [])
        setOpen(true)
      } catch (e) {
        console.error('Search error:', e)
        setError('Search failed')
        setData([])
        setOpen(false)
      } finally {
        setLoading(false)
      }
    }, debounce)

    return () => clearTimeout(timer)
  }, [searchValue, fetcher, debounce])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () =>
      document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full overflow-visible">
      <input
        value={displayValue}
        onChange={(e) => {
          const value = e.target.value
          setDisplayValue(value) // แสดงผล
          setSearchValue(value)  // ใช้ค้นหา
        }}
        placeholder={placeholder}
        className="w-full bg-gray-100 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-600/50 text-[15px]"
      />

      {loading && (
        <div className="absolute right-3 top-2 text-xs text-gray-400">
          Loading...
        </div>
      )}

      {open && (
        <ul className="absolute z-[9999] w-full bg-white border border-violet-600/50 rounded mt-1 max-h-60 overflow-auto shadow-lg">
          {data.length === 0 && !loading && !error && (
            <li className="px-3 py-2 text-sm text-gray-500">
              No results
            </li>
          )}

          {error && (
            <li className="px-3 py-2 text-sm text-red-500">
              {error}
            </li>
          )}

          {data.map((item) => (
            <li
              key={getOptionValue(item)}
              onClick={() => {
                onSelect(item)
                setDisplayValue(getOptionLabel(item))
                setSearchValue('')

                setOpen(false)
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {getOptionLabel(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
