'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import axios from '../utils/axios'
import Link from 'next/link'
export default function Header() {
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await axios.post('/logout')
      localStorage.removeItem('token')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  return (
    <header className='bg-white shadow p-4 flex justify-between items-center'>
      <h1 className='text-2xl font-bold text-gray-800'>
        <Link href='/dashboard'>Dashboard</Link>
      </h1>
      <button
        onClick={handleLogout}
        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
      >
        Logout
      </button>
    </header>
  )
}
