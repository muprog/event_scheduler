'use client'
import { useState } from 'react'
import axios from '../../utils/axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setError('')

  //   try {
  //     const res = await axios.post('/register1', {
  //       username,
  //       email,
  //       password,
  //     })
  //     if (res.status === 400) {
  //       toast.error(res.data.message)
  //     }
  //     if (res.status === 201) {
  //       toast.success('Registered successfully!')
  //       router.push('/login')
  //     }
  //   } catch (err: unknown) {
  //     // console.log(err)
  //     const axiosError = err as { response?: { data?: { message?: string } } }
  //     const message =
  //       axiosError.response?.data?.message || 'Registration failed'
  //     toast.error(message)
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await axios.post('/register1', {
        username,
        email,
        password,
      })
      if (res.status === 400) {
        toast.error(res.data.message)
      }
      if (res.status === 201) {
        toast.success('Registered successfully!')
        router.push('/login')
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      const message =
        axiosError.response?.data?.message || 'Registration failed'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4'>
      <div className='w-full max-w-md bg-white shadow-lg rounded-xl p-8'>
        <h2 className='text-3xl font-bold text-center text-purple-700 mb-6'>
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded'>
              {error}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Username
            </label>
            <input
              type='text'
              required
              className='w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              type='email'
              required
              disabled={isSubmitting}
              className='w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              required
              disabled={isSubmitting}
              className='w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 font-semibold'
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>

          <p className='text-center text-sm text-gray-500 mt-4'>
            Already have an account?{' '}
            <a
              href='/login'
              className='text-purple-600 hover:underline font-medium'
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
