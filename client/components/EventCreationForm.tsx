'use client'
import axios from '../utils/axios'
import React, { useState } from 'react'

const weekdays = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
]
interface EventCreationFormProps {
  createdBy: string
}

export default function EventCreationForm({
  createdBy,
}: EventCreationFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [recurrenceType, setRecurrenceType] = useState<
    'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  >('none')
  const [intervalUnit, setIntervalUnit] = useState<
    'days' | 'weeks' | 'months' | 'years'
  >('days')

  // For custom recurrence
  const [interval, setInterval] = useState(1)
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([])
  const [relativeWeekNumber, setRelativeWeekNumber] = useState(1)
  const [relativeDayOfWeek, setRelativeDayOfWeek] = useState(0)

  const toggleWeekday = (day: number) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // if (!name || !startDateTime || !endDateTime || !description) {
    //   alert('Please provide event name, description, and start date/time')
    //   return
    // }

    if (
      !name ||
      !startDateTime ||
      (!endDateTime && recurrenceType !== 'none') ||
      !description
    ) {
      alert('Please provide event name, description, and date/time')
      return
    }

    let recurrence: any = { frequency: recurrenceType }

    if (recurrenceType === 'custom') {
      recurrence = {
        frequency: 'custom',
        interval,
        intervalUnit,
        daysOfWeek: selectedWeekdays.length > 0 ? selectedWeekdays : undefined,
        relativePattern: {
          weekNumber: relativeWeekNumber,
          dayOfWeek: relativeDayOfWeek,
        },
      }
    }

    if (recurrenceType === 'none') {
      recurrence = { frequency: 'none' }
    }

    try {
      // if (new Date(endDateTime) <= new Date(startDateTime)) {
      //   alert('End time must be after start time.')
      //   return
      // }
      if (
        recurrenceType !== 'none' &&
        new Date(endDateTime) <= new Date(startDateTime)
      ) {
        alert('End time must be after start time.')
        return
      }
      const payload: any = {
        name,
        description: description.trim(),
        startDateTime: new Date(startDateTime).toISOString(),
        recurrence,
        createdBy,
      }

      if (recurrenceType !== 'none' && endDateTime) {
        payload.endDateTime = new Date(endDateTime).toISOString()
      }

      const response = await axios.post(
        '/events',
        payload
        //    {
        //   name,
        //   description: description.trim(),
        //   startDateTime: new Date(startDateTime).toISOString(),
        //   endDateTime,
        //   recurrence,
        //   createdBy,
        // }
      )

      if (response.status === 201) {
        alert('Event created successfully')
        setName('')
        setDescription('')
        setStartDateTime('')
        setRecurrenceType('none')
        setInterval(1)
        setSelectedWeekdays([])
        setRelativeWeekNumber(1)
        setRelativeDayOfWeek(0)
      } else {
        alert('Failed to create event')
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating event')
    }
  }

  return (
    <div className='mt-8 bg-white shadow rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4'>Create New Event</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block font-medium mb-1'>Event Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full border rounded px-3 py-2'
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full border rounded px-3 py-2'
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Start Date & Time</label>
          <input
            type='datetime-local'
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            className='w-full border rounded px-3 py-2'
            required
          />
        </div>

        {/* <div>
          <label className='block font-medium mb-1'>End Date & Time</label>
          <input
            type='datetime-local'
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            className='w-full border rounded px-3 py-2'
            required
          />
        </div> */}

        {recurrenceType !== 'none' && (
          <div>
            <label className='block font-medium mb-1'>End Date & Time</label>
            <input
              type='datetime-local'
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              className='w-full border rounded px-3 py-2'
            />
          </div>
        )}

        <div>
          <label className='block font-medium mb-1'>Recurrence</label>
          <select
            value={recurrenceType}
            onChange={(e) => setRecurrenceType(e.target.value as any)}
            className='w-full border rounded px-3 py-2'
          >
            <option value='none'>None (One-time event)</option>
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
            <option value='monthly'>Monthly</option>
            <option value='yearly'>Yearly</option>
            <option value='custom'>Custom (Complex)</option>
          </select>
        </div>

        {recurrenceType === 'custom' && (
          <>
            <div>
              <label className='block font-medium mb-1'>Interval</label>
              <div className='flex space-x-2'>
                <input
                  type='number'
                  min={1}
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                  className='border rounded px-3 py-2 w-1/2'
                />
                <select
                  value={intervalUnit}
                  onChange={(e) =>
                    setIntervalUnit(
                      e.target.value as 'days' | 'weeks' | 'months' | 'years'
                    )
                  }
                  className='border rounded px-3 py-2 w-1/2'
                >
                  <option value='days'>Day(s)</option>
                  <option value='weeks'>Week(s)</option>
                  <option value='months'>Month(s)</option>
                  <option value='years'>Year(s)</option>
                </select>
              </div>
            </div>

            <div>
              <label className='block font-medium mb-1'>
                Select Weekdays (optional)
              </label>
              <div className='flex flex-wrap gap-2'>
                {weekdays.map(({ label, value }) => (
                  <label
                    key={value}
                    className='inline-flex items-center space-x-1'
                  >
                    <input
                      type='checkbox'
                      checked={selectedWeekdays.includes(value)}
                      onChange={() => toggleWeekday(value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {recurrenceType === 'custom' && intervalUnit === 'months' && (
              <div>
                <label className='block font-medium mb-1'>
                  Relative Date Pattern (e.g., 2nd Friday of the month)
                </label>
                <div className='flex space-x-2'>
                  <select
                    value={relativeWeekNumber}
                    onChange={(e) =>
                      setRelativeWeekNumber(parseInt(e.target.value))
                    }
                    className='border rounded px-3 py-2'
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num === 5
                          ? 'Last'
                          : `${num}${
                              num === 1
                                ? 'st'
                                : num === 2
                                ? 'nd'
                                : num === 3
                                ? 'rd'
                                : 'th'
                            }`}
                      </option>
                    ))}
                  </select>

                  <select
                    value={relativeDayOfWeek}
                    onChange={(e) =>
                      setRelativeDayOfWeek(parseInt(e.target.value))
                    }
                    className='border rounded px-3 py-2'
                  >
                    {weekdays.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </>
        )}

        <button
          type='submit'
          className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition'
        >
          Create Event
        </button>
      </form>
    </div>
  )
}
