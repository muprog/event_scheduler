// 'use client'
// import axios from '../../utils/axios'
// import React, { useState } from 'react'
// import { jwtDecode } from 'jwt-decode'
// import { CalendarPlus, Repeat } from 'lucide-react'
// import toast from 'react-hot-toast'

// const weekdays = [
//   { label: 'Sunday', value: 0 },
//   { label: 'Monday', value: 1 },
//   { label: 'Tuesday', value: 2 },
//   { label: 'Wednesday', value: 3 },
//   { label: 'Thursday', value: 4 },
//   { label: 'Friday', value: 5 },
//   { label: 'Saturday', value: 6 },
// ]

// interface DecodedToken {
//   email: string
// }

// export default function EventCreationForm() {
//   const token =
//     typeof window !== 'undefined' ? localStorage.getItem('token') : null
//   const decoded: DecodedToken | null = token ? jwtDecode(token) : null
//   const createdBy = decoded?.email || ''

//   const [name, setName] = useState('')
//   const [description, setDescription] = useState('')
//   const [startDateTime, setStartDateTime] = useState('')
//   const [endDateTime, setEndDateTime] = useState('')
//   const [recurrenceType, setRecurrenceType] = useState<
//     'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
//   >('none')

//   const [intervalUnit, setIntervalUnit] = useState<
//     'days' | 'weeks' | 'months' | 'years'
//   >('days')
//   const [interval, setInterval] = useState(1)
//   const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([])
//   const [relativeWeekNumber, setRelativeWeekNumber] = useState(1)
//   const [relativeDayOfWeek, setRelativeDayOfWeek] = useState(0)

//   const toggleWeekday = (day: number) => {
//     setSelectedWeekdays((prev) =>
//       prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
//     )
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (
//       !name ||
//       !startDateTime ||
//       (!endDateTime && recurrenceType !== 'none') ||
//       !description
//     ) {
//       toast.error('Please fill out all required fields.')
//       return
//     }

//     let recurrence: any = { frequency: recurrenceType }

//     if (recurrenceType === 'custom') {
//       recurrence = {
//         frequency: 'custom',
//         interval,
//         intervalUnit,
//         daysOfWeek: selectedWeekdays.length > 0 ? selectedWeekdays : undefined,
//         relativePattern: {
//           weekNumber: relativeWeekNumber,
//           dayOfWeek: relativeDayOfWeek,
//         },
//       }
//     }

//     if (recurrenceType === 'none') {
//       recurrence = { frequency: 'none' }
//     }

//     try {
//       if (
//         recurrenceType !== 'none' &&
//         new Date(endDateTime) <= new Date(startDateTime)
//       ) {
//         toast.error('End date/time must be after start date/time.')
//         return
//       }

//       const payload: any = {
//         name,
//         description: description.trim(),
//         startDateTime: new Date(startDateTime).toISOString(),
//         recurrence,
//         createdBy,
//       }

//       if (recurrenceType !== 'none' && endDateTime) {
//         payload.endDateTime = new Date(endDateTime).toISOString()
//       }

//       const response = await axios.post('/events', payload)

//       if (response.status === 201) {
//         toast.success('✅ Event created successfully!')
//         setName('')
//         setDescription('')
//         setStartDateTime('')
//         setEndDateTime('')
//         setRecurrenceType('none')
//         setInterval(1)
//         setSelectedWeekdays([])
//         setRelativeWeekNumber(1)
//         setRelativeDayOfWeek(0)
//       } else {
//         toast.error('❌ Failed to create event.')
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Error creating event.')
//     }
//   }

//   return (
//     <div className='max-w-3xl mx-auto mt-12 bg-white shadow-lg rounded-2xl p-8'>
//       <h2 className='text-3xl font-bold text-purple-700 flex items-center gap-2 mb-6'>
//         <CalendarPlus className='w-7 h-7' />
//         Create a New Event
//       </h2>
//       <form onSubmit={handleSubmit} className='space-y-6'>
//         {/* Event Name */}
//         <div>
//           <label className='block text-sm font-medium text-gray-700'>
//             Event Name *
//           </label>
//           <input
//             type='text'
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400'
//             required
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className='block text-sm font-medium text-gray-700'>
//             Description *
//           </label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400'
//             rows={3}
//             required
//           />
//         </div>

//         {/* Start Date & Time */}
//         <div>
//           <label className='block text-sm font-medium text-gray-700'>
//             Start Date & Time *
//           </label>
//           <input
//             type='datetime-local'
//             value={startDateTime}
//             onChange={(e) => setStartDateTime(e.target.value)}
//             className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400'
//             required
//           />
//         </div>

//         {/* Conditional End Date */}
//         {recurrenceType !== 'none' && (
//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               End Date & Time *
//             </label>
//             <input
//               type='datetime-local'
//               value={endDateTime}
//               onChange={(e) => setEndDateTime(e.target.value)}
//               className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400'
//             />
//           </div>
//         )}

//         {/* Recurrence */}
//         <div>
//           <label className='block text-sm font-medium text-gray-700'>
//             Recurrence
//           </label>
//           <select
//             value={recurrenceType}
//             onChange={(e) => setRecurrenceType(e.target.value as any)}
//             className='mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
//           >
//             <option value='none'>None (One-time event)</option>
//             <option value='daily'>Daily</option>
//             <option value='weekly'>Weekly</option>
//             <option value='monthly'>Monthly</option>
//             <option value='yearly'>Yearly</option>
//             <option value='custom'>Custom</option>
//           </select>
//         </div>

//         {/* Custom Recurrence Section */}
//         {recurrenceType === 'custom' && (
//           <div className='border-t pt-6'>
//             <h3 className='text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2'>
//               <Repeat className='w-5 h-5' />
//               Custom Recurrence Settings
//             </h3>

//             {/* Interval and Unit */}
//             <div className='flex gap-4'>
//               <input
//                 type='number'
//                 min={1}
//                 value={interval}
//                 onChange={(e) => setInterval(parseInt(e.target.value))}
//                 className='w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
//               />
//               <select
//                 value={intervalUnit}
//                 onChange={(e) =>
//                   setIntervalUnit(
//                     e.target.value as 'days' | 'weeks' | 'months' | 'years'
//                   )
//                 }
//                 className='w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
//               >
//                 <option value='days'>Day(s)</option>
//                 <option value='weeks'>Week(s)</option>
//                 <option value='months'>Month(s)</option>
//                 <option value='years'>Year(s)</option>
//               </select>
//             </div>

//             {/* Weekday Selector */}
//             <div className='mt-4'>
//               <label className='block font-medium text-sm mb-1'>
//                 Select Weekdays (Optional)
//               </label>
//               <div className='flex flex-wrap gap-3'>
//                 {weekdays.map(({ label, value }) => (
//                   <label
//                     key={value}
//                     className='inline-flex items-center gap-2 cursor-pointer'
//                   >
//                     <input
//                       type='checkbox'
//                       checked={selectedWeekdays.includes(value)}
//                       onChange={() => toggleWeekday(value)}
//                     />
//                     <span>{label}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Relative Pattern */}
//             {intervalUnit === 'months' && (
//               <div className='mt-4 flex gap-4'>
//                 <select
//                   value={relativeWeekNumber}
//                   onChange={(e) =>
//                     setRelativeWeekNumber(parseInt(e.target.value))
//                   }
//                   className='w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
//                 >
//                   {[1, 2, 3, 4, 5].map((num) => (
//                     <option key={num} value={num}>
//                       {num === 5
//                         ? 'Last'
//                         : `${num}${['st', 'nd', 'rd', 'th'][num - 1]}`}
//                     </option>
//                   ))}
//                 </select>

//                 <select
//                   value={relativeDayOfWeek}
//                   onChange={(e) =>
//                     setRelativeDayOfWeek(parseInt(e.target.value))
//                   }
//                   className='w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
//                 >
//                   {weekdays.map(({ label, value }) => (
//                     <option key={value} value={value}>
//                       {label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Submit */}
//         <div className='text-right'>
//           <button
//             type='submit'
//             className='bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition'
//           >
//             Create Event
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

'use client'
import axios from '../../utils/axios'
import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { CalendarPlus, Repeat } from 'lucide-react'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
const weekdays = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
]

interface DecodedToken {
  email: string
}
interface Recurrence {
  frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  interval?: number
  intervalUnit?: 'days' | 'weeks' | 'months' | 'years'
  daysOfWeek?: number[]
  relativePattern?: {
    weekNumber: number
    dayOfWeek: number
  }
}
interface EventPayload {
  name: string
  description: string
  startDateTime: string
  endDateTime?: string
  recurrence: Recurrence
  createdBy: string
}

export default function EventCreationForm() {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const decoded: DecodedToken | null = token ? jwtDecode(token) : null
  const createdBy = decoded?.email || ''

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
    if (
      !name ||
      !startDateTime ||
      (!endDateTime && recurrenceType !== 'none') ||
      !description
    ) {
      toast.error('Please fill out all required fields.')
      return
    }

    let recurrence: Recurrence = { frequency: recurrenceType }

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
      if (
        recurrenceType !== 'none' &&
        new Date(endDateTime) <= new Date(startDateTime)
      ) {
        toast.error('End date/time must be after start date/time.')
        return
      }

      const payload: EventPayload = {
        name,
        description: description.trim(),
        startDateTime: new Date(startDateTime).toISOString(),
        recurrence,
        createdBy,
      }

      if (recurrenceType !== 'none' && endDateTime) {
        payload.endDateTime = new Date(endDateTime).toISOString()
      }

      const response = await axios.post('/events', payload)

      if (response.status === 201) {
        toast.success('✅ Event created successfully!')
        setName('')
        setDescription('')
        setStartDateTime('')
        setEndDateTime('')
        setRecurrenceType('none')
        setInterval(1)
        setSelectedWeekdays([])
        setRelativeWeekNumber(1)
        setRelativeDayOfWeek(0)
      } else {
        toast.error('❌ Failed to create event.')
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error creating event.')
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred.')
      }
    }
  }

  return (
    <div className='max-w-3xl mx-auto mt-12 bg-white shadow-lg rounded-2xl p-8'>
      <h2 className='text-3xl font-bold text-purple-700 flex items-center gap-2 mb-6'>
        <CalendarPlus className='w-7 h-7' />
        Create a New Event
      </h2>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Event Name */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Event Name *
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400'
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400'
            rows={3}
            required
          />
        </div>

        {/* Start Date & Time */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Start Date & Time *
          </label>
          <input
            type='datetime-local'
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400'
            required
          />
        </div>

        {/* Conditional End Date */}
        {recurrenceType !== 'none' && (
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              End Date & Time *
            </label>
            <input
              type='datetime-local'
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400'
            />
          </div>
        )}

        {/* Recurrence */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Recurrence
          </label>
          <select
            value={recurrenceType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setRecurrenceType(e.target.value as typeof recurrenceType)
            }
            className='mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
          >
            <option value='none'>None (One-time event)</option>
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
            <option value='monthly'>Monthly</option>
            <option value='yearly'>Yearly</option>
            <option value='custom'>Custom</option>
          </select>
        </div>

        {/* Custom Recurrence Section */}
        {recurrenceType === 'custom' && (
          <div className='border-t pt-6'>
            <h3 className='text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2'>
              <Repeat className='w-5 h-5' />
              Custom Recurrence Settings
            </h3>

            {/* Interval and Unit */}
            <div className='flex gap-4'>
              <input
                type='number'
                min={1}
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value))}
                className='w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
              />
              <select
                value={intervalUnit}
                onChange={(e) =>
                  setIntervalUnit(
                    e.target.value as 'days' | 'weeks' | 'months' | 'years'
                  )
                }
                className='w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
              >
                <option value='days'>Day(s)</option>
                <option value='weeks'>Week(s)</option>
                <option value='months'>Month(s)</option>
                <option value='years'>Year(s)</option>
              </select>
            </div>

            {/* Weekday Selector */}
            <div className='mt-4'>
              <label className='block font-medium text-sm mb-1'>
                Select Weekdays (Optional)
              </label>
              <div className='flex flex-wrap gap-3'>
                {weekdays.map(({ label, value }) => (
                  <label
                    key={value}
                    className='inline-flex items-center gap-2 cursor-pointer'
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

            {/* Relative Pattern */}
            {intervalUnit === 'months' && (
              <div className='mt-4 flex gap-4'>
                <select
                  value={relativeWeekNumber}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setRelativeWeekNumber(parseInt(e.target.value))
                  }
                  className='w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num === 5
                        ? 'Last'
                        : `${num}${['st', 'nd', 'rd', 'th'][num - 1]}`}
                    </option>
                  ))}
                </select>

                <select
                  value={relativeDayOfWeek}
                  onChange={(e) =>
                    setRelativeDayOfWeek(parseInt(e.target.value))
                  }
                  className='w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
                >
                  {weekdays.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <div className='text-right'>
          <button
            type='submit'
            className='bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition'
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  )
}
