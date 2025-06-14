'use client'

import axios from '../../../utils/axios'
import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { CalendarPlus, Repeat } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter, useParams } from 'next/navigation'
import { AxiosError } from 'axios'
interface IRecurrenceRule {
  frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  interval?: number
  intervalUnit?: 'days' | 'weeks' | 'months' | 'years'
  daysOfWeek?: number[]
  nthWeekdayOfMonth?: { week: number; weekday: number }
}

interface DecodedToken {
  email: string
}

const weekdays = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
]
interface EventPayload {
  title: string
  description: string
  startDate: string
  recurrenceRule: IRecurrenceRule
  endDateTime?: string
  createdBy: string
}

function toDatetimeLocal(dateStr: string | undefined | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const offset = d.getTimezoneOffset()
  const localDate = new Date(d.getTime() - offset * 60000)
  return localDate.toISOString().slice(0, 16)
}

export default function EventEditPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const decoded: DecodedToken | null = token ? jwtDecode(token) : null
  const createdBy = decoded?.email || ''

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [recurrenceType, setRecurrenceType] =
    useState<IRecurrenceRule['frequency']>('none')
  const [intervalUnit, setIntervalUnit] =
    useState<IRecurrenceRule['intervalUnit']>('days')
  const [interval, setInterval] = useState(1)
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([])
  const [relativeWeekNumber, setRelativeWeekNumber] = useState(1)
  const [relativeDayOfWeek, setRelativeDayOfWeek] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventId) {
      toast.error('No event ID provided')
      return
    }

    async function fetchEvent() {
      try {
        const res = await axios.get(`/events/${eventId}`)
        const event = res.data.event

        setName(event.title || '')
        setDescription(event.description || '')
        setStartDateTime(toDatetimeLocal(event.startDate))
        setEndDateTime(toDatetimeLocal(event.endDateTime))

        if (event.recurrenceRule) {
          setRecurrenceType(event.recurrenceRule.frequency)
          setInterval(event.recurrenceRule.interval ?? 1)
          setIntervalUnit(event.recurrenceRule.intervalUnit ?? 'days')
          setSelectedWeekdays(event.recurrenceRule.daysOfWeek ?? [])
          if (event.recurrenceRule.nthWeekdayOfMonth) {
            setRelativeWeekNumber(event.recurrenceRule.nthWeekdayOfMonth.week)
            setRelativeDayOfWeek(event.recurrenceRule.nthWeekdayOfMonth.weekday)
          } else {
            setRelativeWeekNumber(1)
            setRelativeDayOfWeek(0)
          }
        } else {
          setRecurrenceType('none')
        }

        setLoading(false)
      } catch (error) {
        toast.error('Failed to load event data.')
        console.error(error)
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

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

    let recurrence: IRecurrenceRule = { frequency: recurrenceType }

    if (recurrenceType === 'custom') {
      recurrence = {
        frequency: 'custom',
        interval,
        intervalUnit,
        daysOfWeek: selectedWeekdays.length > 0 ? selectedWeekdays : undefined,
        nthWeekdayOfMonth:
          intervalUnit === 'months'
            ? { week: relativeWeekNumber, weekday: relativeDayOfWeek }
            : undefined,
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
        title: name,
        description: description.trim(),
        startDate: new Date(startDateTime).toISOString(),
        recurrenceRule: recurrence,
        createdBy,
      }

      if (recurrenceType !== 'none' && endDateTime) {
        payload.endDateTime = new Date(endDateTime).toISOString()
      }

      const response = await axios.put(`/events/${eventId}`, payload)

      if (response.status === 200) {
        toast.success('✅ Event updated successfully!')
        router.push('/list-view')
      } else {
        toast.error('❌ Failed to update event.')
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Error updating event.')
      } else {
        toast.error('Error updating event.')
      }
    }
  }

  if (loading)
    return (
      <p className='text-center text-gray-500 mt-10'>Loading event data...</p>
    )

  return (
    <div className='max-w-3xl mx-auto mt-12 bg-white shadow-lg rounded-2xl p-8'>
      <h2 className='text-3xl font-bold text-purple-700 flex items-center gap-2 mb-6'>
        <CalendarPlus className='w-7 h-7' />
        Edit Event
      </h2>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Event Name *
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400'
            rows={3}
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Start Date & Time *
          </label>
          <input
            type='datetime-local'
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400'
            required
          />
        </div>
        {recurrenceType !== 'none' && (
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              End Date & Time *
            </label>
            <input
              type='datetime-local'
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400'
            />
          </div>
        )}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Recurrence
          </label>
          <select
            value={recurrenceType}
            onChange={(e) =>
              setRecurrenceType(e.target.value as IRecurrenceRule['frequency'])
            }
            className='mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400'
          >
            <option value='none'>None</option>
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
            <option value='monthly'>Monthly</option>
            <option value='yearly'>Yearly</option>
            <option value='custom'>Custom</option>
          </select>
        </div>

        {recurrenceType === 'custom' && (
          <div className='border-t pt-6'>
            <h3 className='text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2'>
              <Repeat className='w-5 h-5' />
              Custom Recurrence Settings
            </h3>
            <div className='flex gap-4'>
              <input
                type='number'
                min={1}
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value))}
                className='w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400'
              />
              <select
                value={intervalUnit}
                onChange={(e) =>
                  setIntervalUnit(
                    e.target.value as IRecurrenceRule['intervalUnit']
                  )
                }
                className='w-2/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400'
              >
                <option value='days'>Day(s)</option>
                <option value='weeks'>Week(s)</option>
                <option value='months'>Month(s)</option>
                <option value='years'>Year(s)</option>
              </select>
            </div>

            <div className='mt-4'>
              <label className='block font-medium text-sm mb-1'>
                Select Weekdays (Optional)
              </label>
              <div className='flex flex-wrap gap-3'>
                {weekdays.map(({ label, value }) => (
                  <label key={value} className='inline-flex items-center gap-2'>
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

            {intervalUnit === 'months' && (
              <div className='mt-4 flex gap-4'>
                <select
                  value={relativeWeekNumber}
                  onChange={(e) =>
                    setRelativeWeekNumber(parseInt(e.target.value))
                  }
                  className='w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400'
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
                  className='w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400'
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

        <div className='text-right'>
          <button
            type='submit'
            className='bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition'
          >
            Update Event
          </button>
        </div>
      </form>
    </div>
  )
}

// 'use client'

// import axios from '../../../utils/axios'
// import React, { useEffect, useState } from 'react'
// import { jwtDecode } from 'jwt-decode'
// import { CalendarPlus, Repeat } from 'lucide-react'
// import toast from 'react-hot-toast'
// import { useRouter, useParams } from 'next/navigation'

// interface IRecurrenceRule {
//   frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
//   interval?: number
//   intervalUnit?: 'days' | 'weeks' | 'months' | 'years'
//   daysOfWeek?: number[]
//   nthWeekdayOfMonth?: { week: number; weekday: number }
// }

// interface DecodedToken {
//   email: string
// }

// const weekdays = [
//   { label: 'Sunday', value: 0 },
//   { label: 'Monday', value: 1 },
//   { label: 'Tuesday', value: 2 },
//   { label: 'Wednesday', value: 3 },
//   { label: 'Thursday', value: 4 },
//   { label: 'Friday', value: 5 },
//   { label: 'Saturday', value: 6 },
// ]

// function toDatetimeLocal(dateStr: string | undefined | null) {
//   if (!dateStr) return ''
//   const d = new Date(dateStr)
//   if (isNaN(d.getTime())) return ''
//   const offset = d.getTimezoneOffset()
//   const localDate = new Date(d.getTime() - offset * 60000)
//   return localDate.toISOString().slice(0, 16)
// }

// export default function EventEditPage() {
//   const router = useRouter()
//   const params = useParams()
//   const eventId = params.id
//   const token =
//     typeof window !== 'undefined' ? localStorage.getItem('token') : null
//   const decoded: DecodedToken | null = token ? jwtDecode(token) : null
//   const createdBy = decoded?.email || ''

//   const [name, setName] = useState('')
//   const [description, setDescription] = useState('')
//   const [startDateTime, setStartDateTime] = useState('')
//   const [endDateTime, setEndDateTime] = useState('')
//   const [recurrenceType, setRecurrenceType] =
//     useState<IRecurrenceRule['frequency']>('none')
//   const [intervalUnit, setIntervalUnit] =
//     useState<IRecurrenceRule['intervalUnit']>('days')
//   const [interval, setInterval] = useState(1)
//   const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([])
//   const [relativeWeekNumber, setRelativeWeekNumber] = useState(1)
//   const [relativeDayOfWeek, setRelativeDayOfWeek] = useState(0)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (!eventId) {
//       toast.error('No event ID provided')
//       return
//     }

//     async function fetchEvent() {
//       try {
//         const res = await axios.get(`/events/${eventId}`)
//         const event = res.data.event

//         setName(event.title || '')
//         setDescription(event.description || '')
//         setStartDateTime(toDatetimeLocal(event.startDate))
//         setEndDateTime(toDatetimeLocal(event.endDateTime))

//         if (event.recurrenceRule) {
//           setRecurrenceType(event.recurrenceRule.frequency)
//           setInterval(event.recurrenceRule.interval ?? 1)
//           setIntervalUnit(event.recurrenceRule.intervalUnit ?? 'days')
//           setSelectedWeekdays(event.recurrenceRule.daysOfWeek ?? [])
//           if (event.recurrenceRule.nthWeekdayOfMonth) {
//             setRelativeWeekNumber(event.recurrenceRule.nthWeekdayOfMonth.week)
//             setRelativeDayOfWeek(event.recurrenceRule.nthWeekdayOfMonth.weekday)
//           } else {
//             setRelativeWeekNumber(1)
//             setRelativeDayOfWeek(0)
//           }
//         } else {
//           setRecurrenceType('none')
//         }

//         setLoading(false)
//       } catch (error) {
//         toast.error('Failed to load event data.')
//         console.error(error)
//         setLoading(false)
//       }
//     }

//     fetchEvent()
//   }, [eventId])

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

//     let recurrence: IRecurrenceRule = { frequency: recurrenceType }

//     if (recurrenceType === 'custom') {
//       recurrence = {
//         frequency: 'custom',
//         interval,
//         intervalUnit,
//         daysOfWeek: selectedWeekdays.length > 0 ? selectedWeekdays : undefined,
//         nthWeekdayOfMonth:
//           intervalUnit === 'months'
//             ? { week: relativeWeekNumber, weekday: relativeDayOfWeek }
//             : undefined,
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
//         title: name,
//         description: description.trim(),
//         startDate: new Date(startDateTime).toISOString(),
//         recurrenceRule: recurrence,
//         createdBy,
//       }

//       if (recurrenceType !== 'none' && endDateTime) {
//         payload.endDateTime = new Date(endDateTime).toISOString()
//       }

//       const response = await axios.put(`/events/${eventId}`, payload)

//       if (response.status === 200) {
//         toast.success('✅ Event updated successfully!')
//         router.push('/list-view')
//       } else {
//         toast.error('❌ Failed to update event.')
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Error updating event.')
//     }
//   }

//   if (loading)
//     return (
//       <p className='text-center text-gray-500 mt-10'>Loading event data...</p>
//     )

//   return (
//     <div className='max-w-3xl mx-auto mt-12 bg-white shadow-lg rounded-2xl p-8'>
//       <h2 className='text-3xl font-bold text-purple-700 flex items-center gap-2 mb-6'>
//         <CalendarPlus className='w-7 h-7' />
//         Edit Event
//       </h2>
//       <form onSubmit={handleSubmit} className='space-y-6'>
//         <div>
//           <label className='block text-sm font-medium text-gray-700'>
//             Event Name *
//           </label>
//           <input
//             type='text'
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400'
//             required
//           />
//         </div>
//         <div>
//           <label className='block text-sm font-medium text-gray-700'>
//             Description *
//           </label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400'
//             rows={3}
//             required
//           />
//         </div>
//         <div>
//           <label className='block text-sm font-medium text-gray-700'>
//             Start Date & Time *
//           </label>
//           <input
//             type='datetime-local'
//             value={startDateTime}
//             onChange={(e) => setStartDateTime(e.target.value)}
//             className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400'
//             required
//           />
//         </div>
//         {recurrenceType !== 'none' && (
//           <div>
//             <label className='block text-sm font-medium text-gray-700'>
//               End Date & Time *
//             </label>
//             <input
//               type='datetime-local'
//               value={endDateTime}
//               onChange={(e) => setEndDateTime(e.target.value)}
//               className='mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400'
//             />
//           </div>
//         )}
//         <div>
//           <label className='block text-sm font-medium text-gray-700'>
//             Recurrence
//           </label>
//           <select
//             value={recurrenceType}
//             onChange={(e) => setRecurrenceType(e.target.value as any)}
//             className='mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400'
//           >
//             <option value='none'>None</option>
//             <option value='daily'>Daily</option>
//             <option value='weekly'>Weekly</option>
//             <option value='monthly'>Monthly</option>
//             <option value='yearly'>Yearly</option>
//             <option value='custom'>Custom</option>
//           </select>
//         </div>

//         {recurrenceType === 'custom' && (
//           <div className='border-t pt-6'>
//             <h3 className='text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2'>
//               <Repeat className='w-5 h-5' />
//               Custom Recurrence Settings
//             </h3>
//             <div className='flex gap-4'>
//               <input
//                 type='number'
//                 min={1}
//                 value={interval}
//                 onChange={(e) => setInterval(parseInt(e.target.value))}
//                 className='w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400'
//               />
//               <select
//                 value={intervalUnit}
//                 onChange={(e) => setIntervalUnit(e.target.value as any)}
//                 className='w-2/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400'
//               >
//                 <option value='days'>Day(s)</option>
//                 <option value='weeks'>Week(s)</option>
//                 <option value='months'>Month(s)</option>
//                 <option value='years'>Year(s)</option>
//               </select>
//             </div>

//             <div className='mt-4'>
//               <label className='block font-medium text-sm mb-1'>
//                 Select Weekdays (Optional)
//               </label>
//               <div className='flex flex-wrap gap-3'>
//                 {weekdays.map(({ label, value }) => (
//                   <label key={value} className='inline-flex items-center gap-2'>
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

//             {intervalUnit === 'months' && (
//               <div className='mt-4 flex gap-4'>
//                 <select
//                   value={relativeWeekNumber}
//                   onChange={(e) =>
//                     setRelativeWeekNumber(parseInt(e.target.value))
//                   }
//                   className='w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400'
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
//                   className='w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400'
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

//         <div className='text-right'>
//           <button
//             type='submit'
//             className='bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition'
//           >
//             Update Event
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }
