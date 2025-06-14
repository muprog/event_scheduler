'use client'
import { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import { useRouter } from 'next/navigation'
interface RecurrenceRule {
  frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  interval?: number
  intervalUnit?: 'days' | 'weeks' | 'months' | 'years'
  daysOfWeek?: number[]
  nthWeekdayOfMonth?: { week: number; weekday: number }
}

interface Event {
  _id: string
  title: string
  startDate: string
  endDateTime?: string
  recurrenceRule?: RecurrenceRule
}

export default function ListViewPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('/me/events', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const sorted = res.data.events.sort(
          (a: Event, b: Event) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )
        setEvents(sorted)
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          const error = err as {
            response?: { data?: { message?: string } }
            message?: string
          }
          setError(
            error.response?.data?.message || error.message || 'Unknown error'
          )
        } else {
          setError('Unknown error')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const confirmAndDelete = async () => {
    if (!confirmDeleteId) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/events/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEvents((prev) => prev.filter((e) => e._id !== confirmDeleteId))
      setConfirmDeleteId(null)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as {
          response?: { data?: { message?: string } }
          message?: string
        }
        alert(
          error.response?.data?.message ||
            error.message ||
            'Failed to delete event'
        )
      } else {
        alert('Failed to delete event')
      }
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`)
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-center text-indigo-700'>
        📋 My Scheduled Events
      </h1>

      {loading && (
        <p className='text-center text-gray-500'>Loading events...</p>
      )}
      {error && <p className='text-center text-red-600 font-medium'>{error}</p>}

      {!loading && !error && events.length === 0 ? (
        <p className='text-center text-gray-500 italic'>
          No upcoming events found.
        </p>
      ) : (
        <ul className='divide-y divide-gray-200'>
          {events.map((event) => (
            <li
              key={event._id}
              className='py-4 px-3 hover:bg-gray-50 rounded-lg transition duration-150 ease-in-out'
            >
              <div className='flex justify-between items-start flex-col sm:flex-row sm:items-center gap-3'>
                <div>
                  <div className='text-lg font-semibold text-gray-800'>
                    {event.title}
                  </div>
                  <div className='text-sm text-gray-600'>
                    {new Date(event.startDate).toLocaleString()} –{' '}
                    {event.endDateTime
                      ? new Date(event.endDateTime).toLocaleString()
                      : 'N/A'}
                  </div>
                  <div className='text-sm text-gray-500'>
                    Recurrence: {event.recurrenceRule?.frequency || 'none'}
                  </div>
                </div>

                <div className='flex gap-4 mt-2 sm:mt-0'>
                  <button
                    className='text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer'
                    onClick={() => handleEdit(event._id)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className='text-red-600 hover:text-red-800 hover:underline font-medium cursor-pointer'
                    // onClick={() => handleDelete(event._id)}
                    onClick={() => setConfirmDeleteId(event._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {confirmDeleteId && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-md text-center'>
            <h2 className='text-lg font-semibold mb-4 text-gray-800'>
              Are you sure you want to delete this event?
            </h2>
            <div className='flex justify-center gap-4'>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300'
              >
                Cancel
              </button>
              <button
                onClick={confirmAndDelete}
                className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 'use client'
// import { useEffect, useState } from 'react'
// import axios from '../../utils/axios'
// import { useRouter } from 'next/navigation'

// import { confirmAlert } from 'react-confirm-alert'
// interface RecurrenceRule {
//   frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
//   interval?: number
//   intervalUnit?: 'days' | 'weeks' | 'months' | 'years'
//   daysOfWeek?: number[]
//   nthWeekdayOfMonth?: { week: number; weekday: number }
// }

// interface Event {
//   _id: string
//   title: string
//   startDate: string
//   endDateTime?: string
//   recurrenceRule?: RecurrenceRule
// }

// export default function ListViewPage() {
//   const [events, setEvents] = useState<Event[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const router = useRouter()
//   const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         const res = await axios.get('/me/events', {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         const sorted = res.data.events.sort(
//           (a: Event, b: Event) =>
//             new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
//         )
//         setEvents(sorted)
//       } catch (err: any) {
//         setError(err.response?.data?.message || err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchEvents()
//   }, [])

//   const confirmAndDelete = async () => {
//     if (!confirmDeleteId) return
//     try {
//       const token = localStorage.getItem('token')
//       await axios.delete(`/events/${confirmDeleteId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setEvents((prev) => prev.filter((e) => e._id !== confirmDeleteId))
//       setConfirmDeleteId(null)
//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Failed to delete event')
//     }
//   }

//   const handleEdit = (id: string) => {
//     router.push(`/edit/${id}`)
//   }

//   return (
//     <div className='p-6 max-w-4xl mx-auto'>
//       <h1 className='text-3xl font-bold mb-6 text-center text-indigo-700'>
//         📋 My Scheduled Events
//       </h1>

//       {loading && (
//         <p className='text-center text-gray-500'>Loading events...</p>
//       )}
//       {error && <p className='text-center text-red-600 font-medium'>{error}</p>}

//       {!loading && !error && events.length === 0 ? (
//         <p className='text-center text-gray-500 italic'>
//           No upcoming events found.
//         </p>
//       ) : (
//         <ul className='divide-y divide-gray-200'>
//           {events.map((event) => (
//             <li
//               key={event._id}
//               className='py-4 px-3 hover:bg-gray-50 rounded-lg transition duration-150 ease-in-out'
//             >
//               <div className='flex justify-between items-start flex-col sm:flex-row sm:items-center gap-3'>
//                 <div>
//                   <div className='text-lg font-semibold text-gray-800'>
//                     {event.title}
//                   </div>
//                   <div className='text-sm text-gray-600'>
//                     {new Date(event.startDate).toLocaleString()} –{' '}
//                     {event.endDateTime
//                       ? new Date(event.endDateTime).toLocaleString()
//                       : 'N/A'}
//                   </div>
//                   <div className='text-sm text-gray-500'>
//                     Recurrence: {event.recurrenceRule?.frequency || 'none'}
//                   </div>
//                 </div>

//                 <div className='flex gap-4 mt-2 sm:mt-0'>
//                   <button
//                     className='text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer'
//                     onClick={() => handleEdit(event._id)}
//                   >
//                     ✏️ Edit
//                   </button>
//                   <button
//                     className='text-red-600 hover:text-red-800 hover:underline font-medium cursor-pointer'
//                     // onClick={() => handleDelete(event._id)}
//                     onClick={() => setConfirmDeleteId(event._id)}
//                   >
//                     🗑️ Delete
//                   </button>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//       {confirmDeleteId && (
//         <div className='fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center'>
//           <div className='bg-white p-6 rounded-lg shadow-md text-center'>
//             <h2 className='text-lg font-semibold mb-4 text-gray-800'>
//               Are you sure you want to delete this event?
//             </h2>
//             <div className='flex justify-center gap-4'>
//               <button
//                 onClick={() => setConfirmDeleteId(null)}
//                 className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300'
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmAndDelete}
//                 className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
//               >
//                 Yes, Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
