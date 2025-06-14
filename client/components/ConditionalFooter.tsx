'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()

  const hideOnPaths = ['/', '/login', '/register']

  if (hideOnPaths.includes(pathname)) return null

  return <Footer />
}
