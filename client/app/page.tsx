'use client'

import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import axios from '../utils/axios'
import {
  FiCalendar,
  FiRepeat,
  FiEye,
  FiEdit,
  FiCheck,
  FiArrowRight,
} from 'react-icons/fi'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<
    'features' | 'how-it-works' | 'pricing'
  >('features')
  axios.defaults.baseURL = process.env.BACKEND_URL
    ? process.env.BACKEND_URL
    : 'http://localhost:5000'
  axios.defaults.withCredentials = true

  return (
    <div className='min-h-screen flex flex-col bg-white'>
      <Head>
        <title>Recur | Advanced Event Scheduling</title>
        <meta
          name='description'
          content='Schedule events with complex recurrence patterns'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* Navigation */}
      <header className='sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100'>
        <div className='container mx-auto px-6 py-4 flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <FiCalendar className='text-purple-600 text-2xl' />
            <span className='text-xl font-bold text-gray-900'>Recur</span>
          </div>
          <nav className='hidden md:flex items-center space-x-8'>
            <button
              onClick={() => setActiveTab('features')}
              className={`font-medium ${
                activeTab === 'features'
                  ? 'text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`font-medium ${
                activeTab === 'how-it-works'
                  ? 'text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`font-medium ${
                activeTab === 'pricing'
                  ? 'text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pricing
            </button>
            <Link
              href='/login'
              className='font-medium text-gray-600 hover:text-gray-900'
            >
              Sign In
            </Link>
          </nav>
          <Link
            href='/register'
            className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium'
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className='py-20 bg-gradient-to-b from-blue-50 to-white'>
        <div className='container mx-auto px-6 flex flex-col lg:flex-row items-center'>
          <div className='lg:w-1/2 mb-12 lg:mb-0'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6'>
              Advanced Event Scheduling{' '}
              <span className='text-purple-600'>Made Simple</span>
            </h1>
            <p className='text-xl text-gray-600 mb-8'>
              Create complex recurring events with intuitive rules and beautiful
              calendar views. Perfect for teams, professionals, and anyone with
              a busy schedule.
            </p>
            <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
              <Link
                href='/register'
                className='px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium text-center'
              >
                Start Scheduling Free
              </Link>
              <Link
                href='#demo'
                className='px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-center'
              >
                Watch Demo
              </Link>
            </div>
          </div>
          <div className='lg:w-1/2 flex justify-center'>
            <div className='relative w-full max-w-lg'>
              <div className='absolute -top-6 -left-6 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
              <div className='absolute -bottom-8 -right-8 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
              <div className='relative bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden'>
                <div className='p-4 bg-gray-50 border-b border-gray-200 flex items-center'>
                  <div className='flex space-x-2'>
                    <div className='w-3 h-3 rounded-full bg-red-500'></div>
                    <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
                    <div className='w-3 h-3 rounded-full bg-green-500'></div>
                  </div>
                  <div className='ml-4 text-sm text-gray-500'>
                    New Event - Monthly Sync
                  </div>
                </div>
                <div className='p-6'>
                  <div className='mb-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      Monthly Team Sync
                    </h3>
                    <p className='text-gray-600'>
                      Every 2nd Wednesday of the month at 10:00 AM
                    </p>
                  </div>
                  <div className='space-y-4'>
                    <div className='flex items-center'>
                      <FiRepeat className='text-purple-500 mr-3' />
                      <span className='text-gray-700'>
                        Recurs: Monthly on 2nd Wednesday
                      </span>
                    </div>
                    <div className='flex items-center'>
                      <FiCalendar className='text-purple-500 mr-3' />
                      <span className='text-gray-700'>
                        Next: June 14, 2023 at 10:00 AM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 bg-white'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Powerful Scheduling Features
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Designed to handle the most complex scheduling needs while
              remaining intuitive to use.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6'>
                <FiCalendar className='text-purple-600 text-xl' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Flexible Recurrence
              </h3>
              <p className='text-gray-600 mb-4'>
                From simple daily events to complex patterns like "every 3rd
                Thursday of the month".
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center'>
                  <FiCheck className='text-green-500 mr-2' />
                  <span className='text-gray-700'>
                    Daily, weekly, monthly, yearly
                  </span>
                </li>
                <li className='flex items-center'>
                  <FiCheck className='text-green-500 mr-2' />
                  <span className='text-gray-700'>Nth day of month/week</span>
                </li>
                <li className='flex items-center'>
                  <FiCheck className='text-green-500 mr-2' />
                  <span className='text-gray-700'>
                    Relative dates (last Friday)
                  </span>
                </li>
              </ul>
            </div>

            <div className='bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6'>
                <FiEye className='text-purple-600 text-xl' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Multiple Views
              </h3>
              <p className='text-gray-600 mb-4'>
                Visualize your schedule the way that works best for you.
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center'>
                  <FiCheck className='text-green-500 mr-2' />
                  <span className='text-gray-700'>
                    Day, week, month calendar views
                  </span>
                </li>
                <li className='flex items-center'>
                  <FiCheck className='text-green-500 mr-2' />
                  <span className='text-gray-700'>Upcoming events list</span>
                </li>
                <li className='flex items-center'>
                  <FiCheck className='text-green-500 mr-2' />
                  <span className='text-gray-700'>Customizable dashboard</span>
                </li>
              </ul>
            </div>

            <div className='bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6'>
                <FiEdit className='text-purple-600 text-xl' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Smart Management
              </h3>
              <p className='text-gray-600 mb-4'>
                Edit events with powerful bulk operations and exceptions.
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center'>
                  <FiCheck className='text-green-500 mr-2' />
                  <span className='text-gray-700'>
                    Edit entire series or single instances
                  </span>
                </li>
                <li className='flex items-center'>
                  <FiCheck className='text-green-500 mr-2' />
                  <span className='text-gray-700'>
                    Drag-and-drop rescheduling
                  </span>
                </li>
                <li className='flex items-center'>
                  <FiCheck className='text-green-500 mr-2' />
                  <span className='text-gray-700'>Conflict detection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-purple-600 text-white'>
        <div className='container mx-auto px-6 text-center'>
          <h2 className='text-3xl font-bold mb-6'>
            Ready to Simplify Your Scheduling?
          </h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Join thousands of professionals who trust Recur for their complex
            scheduling needs.
          </p>
          <Link
            href='/register'
            className='inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium'
          >
            Get Started Free <FiArrowRight className='ml-2' />
          </Link>
          <p className='mt-4 text-blue-100'>
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-12 bg-gray-900 text-gray-400'>
        <div className='container mx-auto px-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
            <div>
              <div className='flex items-center space-x-2 mb-4'>
                <FiCalendar className='text-purple-400 text-xl' />
                <span className='text-xl font-bold text-white'>Recur</span>
              </div>
              <p className='mb-4'>
                Advanced event scheduling for professionals and teams.
              </p>
              <p>© {new Date().getFullYear()} Recur. All rights reserved.</p>
            </div>
          </div>
          <div className='pt-8 border-t border-gray-800 text-sm'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <p>Made with ❤️ for schedulers everywhere</p>
              <div className='flex space-x-6 mt-4 md:mt-0'>
                <Link href='/' className='hover:text-white transition-colors'>
                  Privacy Policy
                </Link>
                <Link href='/' className='hover:text-white transition-colors'>
                  Terms of Service
                </Link>
                <Link href='/' className='hover:text-white transition-colors'>
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
