// 'use client'
// import { useEffect, useState } from 'react'
// import axios from '../../utils/axios'
// import Calendar from 'react-calendar'
// import 'react-calendar/dist/Calendar.css'
// import { jwtDecode } from 'jwt-decode'

// type Event = {
//   _id: string
//   title: string
//   startDate: string
//   endDateTime?: string
// }

// export default function CalendarViewPage() {
//   const [events, setEvents] = useState<Event[]>([])
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date())
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     async function loadEvents() {
//       try {
//         const token = localStorage.getItem('token')
//         if (!token) throw new Error('No token found')

//         const decoded: any = jwtDecode(token)
//         const email = decoded.email

//         const res = await axios.get(`/events?createdBy=${email}`)
//         setEvents(res.data.events)
//       } catch (err: any) {
//         setError(err.response?.data?.message || err.message)
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadEvents()
//   }, [])

//   if (loading) return <p>Loading events…</p>
//   if (error) return <p className='text-red-600'>{error}</p>

//   const eventsOnDay = events.filter((ev) => {
//     const occurrences = generateEventOccurrences(ev)
//     return occurrences.some(
//       (occ) => occ.toDateString() === selectedDate.toDateString()
//     )
//   })

//   function generateEventOccurrences(
//     event: Event & { recurrenceRule?: any }
//   ): Date[] {
//     const { startDate, endDateTime, recurrenceRule } = event
//     const start = new Date(startDate)
//     const end = new Date(endDateTime || startDate) // if no endDateTime, it's one-time

//     const dates: Date[] = []

//     // one-time event
//     if (!recurrenceRule || recurrenceRule.frequency === 'none') {
//       dates.push(start)
//       return dates
//     }

//     const interval = recurrenceRule.interval || 1
//     const unit = recurrenceRule.intervalUnit || 'days'
//     const freq = recurrenceRule.frequency
//     const daysOfWeek = recurrenceRule.daysOfWeek || []

//     let current = new Date(start)

//     while (current <= end) {
//       if (freq === 'daily') {
//         dates.push(new Date(current))
//         current.setDate(current.getDate() + interval)
//       } else if (freq === 'weekly') {
//         // check if this day is in selected weekdays
//         if (daysOfWeek.includes(current.getDay())) {
//           dates.push(new Date(current))
//         }
//         current.setDate(current.getDate() + 1) // advance daily
//       } else if (freq === 'monthly') {
//         dates.push(new Date(current))
//         current.setMonth(current.getMonth() + interval)
//       } else if (freq === 'yearly') {
//         dates.push(new Date(current))
//         current.setFullYear(current.getFullYear() + interval)
//       } else if (freq === 'custom') {
//         if (unit === 'days') {
//           dates.push(new Date(current))
//           current.setDate(current.getDate() + interval)
//         } else if (unit === 'weeks') {
//           if (daysOfWeek.includes(current.getDay())) {
//             dates.push(new Date(current))
//           }
//           current.setDate(current.getDate() + 1) // go daily
//         } else if (unit === 'months') {
//           // e.g. 2nd Friday of the month
//           if (recurrenceRule.nthWeekdayOfMonth) {
//             const { week, weekday } = recurrenceRule.nthWeekdayOfMonth
//             let temp = new Date(current.getFullYear(), current.getMonth(), 1)
//             let count = 0

//             while (temp.getMonth() === current.getMonth()) {
//               if (temp.getDay() === weekday) {
//                 count++
//                 if (
//                   count === week ||
//                   (week === 5 &&
//                     temp.getDate() + 7 >
//                       new Date(
//                         current.getFullYear(),
//                         current.getMonth() + 1,
//                         0
//                       ).getDate())
//                 ) {
//                   dates.push(new Date(temp))
//                   break
//                 }
//               }
//               temp.setDate(temp.getDate() + 1)
//             }
//           }
//           current.setMonth(current.getMonth() + interval)
//         }
//       } else {
//         break
//       }
//     }

//     return dates
//   }

//   return (
//     <div className='p-6 max-w-3xl mx-auto'>
//       <h1 className='text-3xl font-bold mb-4'>My Calendar</h1>

//       <Calendar
//         onChange={(value) => {
//           if (value instanceof Date) {
//             setSelectedDate(value)
//           }
//         }}
//         value={selectedDate}
//       />

//       <div className='mt-6'>
//         <h2 className='text-xl font-semibold mb-2'>
//           Events on {selectedDate.toDateString()}:
//         </h2>

//         {eventsOnDay.length === 0 ? (
//           <p>No events scheduled.</p>
//         ) : (
//           <ul className='list-disc pl-5'>
//             {eventsOnDay.map((ev) => (
//               <li key={ev._id}>{ev.title}</li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   )
// }

'use client'
import { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { jwtDecode } from 'jwt-decode'

type Event = {
  _id: string
  title: string
  startDate: string
  endDateTime?: string
  recurrenceRule?: any
}

export default function CalendarViewPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEvents() {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found')

        const decoded: any = jwtDecode(token)
        const email = decoded.email

        const res = await axios.get(`/events?createdBy=${email}`)
        setEvents(res.data.events)
      } catch (err: any) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [])

  if (loading)
    return <p className='text-center text-gray-600 mt-10'>Loading events…</p>
  if (error)
    return (
      <p className='text-center text-red-600 mt-10 font-semibold'>{error}</p>
    )

  const eventsOnDay = events.filter((ev) => {
    const occurrences = generateEventOccurrences(ev)
    return occurrences.some(
      (occ) => occ.toDateString() === selectedDate.toDateString()
    )
  })

  function generateEventOccurrences(
    event: Event & { recurrenceRule?: any }
  ): Date[] {
    const { startDate, endDateTime, recurrenceRule } = event
    const start = new Date(startDate)
    const end = new Date(endDateTime || startDate)

    const dates: Date[] = []

    if (!recurrenceRule || recurrenceRule.frequency === 'none') {
      dates.push(start)
      return dates
    }

    const interval = recurrenceRule.interval || 1
    const unit = recurrenceRule.intervalUnit || 'days'
    const freq = recurrenceRule.frequency
    const daysOfWeek = recurrenceRule.daysOfWeek || []

    let current = new Date(start)

    while (current <= end) {
      if (freq === 'daily') {
        dates.push(new Date(current))
        current.setDate(current.getDate() + interval)
      } else if (freq === 'weekly') {
        if (daysOfWeek.includes(current.getDay())) {
          dates.push(new Date(current))
        }
        current.setDate(current.getDate() + 1)
      } else if (freq === 'monthly') {
        dates.push(new Date(current))
        current.setMonth(current.getMonth() + interval)
      } else if (freq === 'yearly') {
        dates.push(new Date(current))
        current.setFullYear(current.getFullYear() + interval)
      } else if (freq === 'custom') {
        if (unit === 'days') {
          dates.push(new Date(current))
          current.setDate(current.getDate() + interval)
        } else if (unit === 'weeks') {
          if (daysOfWeek.includes(current.getDay())) {
            dates.push(new Date(current))
          }
          current.setDate(current.getDate() + 1)
        } else if (unit === 'months') {
          if (recurrenceRule.nthWeekdayOfMonth) {
            const { week, weekday } = recurrenceRule.nthWeekdayOfMonth
            let temp = new Date(current.getFullYear(), current.getMonth(), 1)
            let count = 0

            while (temp.getMonth() === current.getMonth()) {
              if (temp.getDay() === weekday) {
                count++
                if (
                  count === week ||
                  (week === 5 &&
                    temp.getDate() + 7 >
                      new Date(
                        current.getFullYear(),
                        current.getMonth() + 1,
                        0
                      ).getDate())
                ) {
                  dates.push(new Date(temp))
                  break
                }
              }
              temp.setDate(temp.getDate() + 1)
            }
          }
          current.setMonth(current.getMonth() + interval)
        }
      } else {
        break
      }
    }

    return dates
  }

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-center text-purple-700'>
        📅 My Calendar
      </h1>

      <div className='bg-white rounded-lg shadow-md p-4'>
        <Calendar
          onChange={(value) => {
            if (value instanceof Date) {
              setSelectedDate(value)
            }
          }}
          value={selectedDate}
          className='mx-auto'
        />
      </div>

      <div className='mt-8 bg-gray-50 p-5 rounded-lg shadow'>
        <h2 className='text-xl font-semibold text-gray-800 mb-3'>
          Events on{' '}
          <span className='text-purple-700'>{selectedDate.toDateString()}</span>
          :
        </h2>

        {eventsOnDay.length === 0 ? (
          <p className='text-gray-500 italic'>No events scheduled.</p>
        ) : (
          <ul className='list-disc pl-5 space-y-2'>
            {eventsOnDay.map((ev) => (
              <li
                key={ev._id}
                className='text-gray-700 hover:text-purple-800 font-medium'
              >
                {ev.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
