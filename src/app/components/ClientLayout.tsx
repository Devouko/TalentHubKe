'use client'

import { usePathname } from 'next/navigation'
import { useSidebar } from '../context/SidebarContext'
import MessagingInterface from '../../components/MessagingInterface'
import { useEffect, useState } from 'react'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useSidebar()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    )
  }
  
  const noSidebarPages = ['/', '/auth', '/signin', '/signup']
  const shouldShowSidebar = !noSidebarPages.includes(pathname)

  if (!shouldShowSidebar) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
        <MessagingInterface />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
      <MessagingInterface />
    </div>
  )
}