'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

export default function ConditionalHeader() {
  const pathname = usePathname()

  const hideOnPaths = ['/', '/login', '/register']

  if (hideOnPaths.includes(pathname)) return null

  return <Header />
}
