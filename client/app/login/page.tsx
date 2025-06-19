'use client'

import { useState } from 'react'
import axios from '../../utils/axios'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await axios.post('/login', {
        email,
        password,
      })

      if (res.status === 200) {
        localStorage.setItem('token', res.data.token)
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as {
          response?: { data?: { message?: string } }
          message?: string
        }
        alert(
          error.response?.data?.message ||
            error.message ||
            'Check you connection'
        )
      } else {
        alert('Check your connection')
      }
      console.log(err)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4'>
      <div className='w-full max-w-md bg-white shadow-lg rounded-xl p-8'>
        <h2 className='text-3xl font-bold text-center text-purple-700 mb-6'>
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className='space-y-5'>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded'>
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email address
            </label>
            <input
              id='email'
              type='email'
              required
              className='w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              required
              className='w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type='submit'
            className='w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 font-semibold'
          >
            Sign In
          </button>

          <p className='text-center text-sm text-gray-500 mt-4'>
            Don&apos;t have an account?{' '}
            <a
              href='/register'
              className='text-purple-600 hover:underline font-medium'
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
