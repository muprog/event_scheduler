// 'use client'

// import { useEffect, useState } from 'react'
// import axios from '../../utils/axios'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// interface UserData {
//   id: string
//   username: string
//   email: string
// }

// export default function DashboardPage() {
//   const [user, setUser] = useState<UserData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const router = useRouter()

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get('/user')

//         if (response.status === 200) {
//           setUser(response.data.user)
//         } else {
//           setError('Failed to fetch user data')
//           router.push('/login')
//         }
//       } catch (err: any) {
//         setError(
//           err.response?.data?.message || 'Session expired, please login again'
//         )
//         router.push('/login')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUserData()
//   }, [router])

//   if (loading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-gray-100'>
//         <div className='text-2xl font-semibold'>Loading dashboard...</div>
//       </div>
//     )
//   }

//   return (
//     <div className=' bg-gray-100'>
//       <main className='p-6'>
//         <div className='mb-6 flex flex-col space-y-4'>
//           <Link
//             href='/create-event'
//             className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center w-48'
//           >
//             Create Event
//           </Link>

//           <Link
//             href='/calendar-view'
//             className='bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-center w-48'
//           >
//             Calendar View
//           </Link>

//           <Link
//             href='/list-view'
//             className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center w-48'
//           >
//             List View
//           </Link>
//         </div>
//       </main>
//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, ListTodo, PlusCircle } from 'lucide-react'

interface UserData {
  id: string
  username: string
  email: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/user')

        if (response.status === 200) {
          setUser(response.data.user)
        } else {
          setError('Failed to fetch user data')
          router.push('/login')
        }
      } catch (err: unknown) {
        console.log(err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-2xl font-semibold text-gray-600'>
          Loading dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8'>
      <div className='max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8'>
        <h1 className='text-3xl font-bold mb-2 text-gray-800'>
          Welcome, {user?.username || 'User'} 👋
        </h1>
        <p className='text-gray-500 mb-8'>What would you like to do today?</p>

        <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3'>
          <Link
            href='/create-event'
            className='flex flex-col items-center justify-center rounded-xl bg-blue-500 text-white p-6 hover:bg-blue-600 transition transform hover:scale-105 shadow-lg'
          >
            <PlusCircle className='w-8 h-8 mb-2' />
            <span>Create Event</span>
          </Link>

          <Link
            href='/calendar-view'
            className='flex flex-col items-center justify-center rounded-xl bg-purple-500 text-white p-6 hover:bg-purple-600 transition transform hover:scale-105 shadow-lg'
          >
            <CalendarDays className='w-8 h-8 mb-2' />
            <span>Calendar View</span>
          </Link>

          <Link
            href='/list-view'
            className='flex flex-col items-center justify-center rounded-xl bg-green-500 text-white p-6 hover:bg-green-600 transition transform hover:scale-105 shadow-lg'
          >
            <ListTodo className='w-8 h-8 mb-2' />
            <span>List View</span>
          </Link>
        </div>

        {error && <p className='mt-6 text-red-600 text-sm'>{error}</p>}
      </div>
    </div>
  )
}
