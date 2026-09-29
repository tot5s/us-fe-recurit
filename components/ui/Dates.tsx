'use client'

import { useRef } from 'react'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

type DatesProps = {
  title?: string
  date: string
  placeholder?: string
  onDateHandler: (date: string) => void
}

export default function Dates({
  title,
  date,
  placeholder,
  onDateHandler,
}: DatesProps) {
  const dateInputRef = useRef<HTMLInputElement>(null)

  const handleOpenDatePicker = () => {
    dateInputRef.current?.showPicker()
  }

  return (
    <div className="space-y-3">
      <div>
        <span className="font-bold">
          {title}
        </span>
      </div>

      <div className="relative">
        {!date ? (
          <>
            <input
              type="text"
              value=""
              placeholder={placeholder || ''}
              readOnly
              className="border border-gray-300 rounded-xl p-2 w-full placeholder:text-gray-300 cursor-pointer"
              onClick={handleOpenDatePicker}
            />

            <input
              ref={dateInputRef}
              type="date"
              value=""
              className="absolute opacity-0 pointer-events-none"
              onChange={(e) => {
                 const date = e.target.value

                if (!date) return
                onDateHandler(dayjs(date).format('YYYY-MM-DDT10:00:00+09:00'))
              }}
            />
          </>
        ) : (
          <input
            className="border border-gray-300 rounded-xl p-2 w-full"
            type="datetime-local"
            value={date ? date.slice(0, 16) : ''}
            onChange={(e) => {
              onDateHandler(e.target.value)
            }}
          />
        )}
      </div>
    </div>
  )
}
