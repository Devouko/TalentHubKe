'use client'

import { SessionProvider } from 'next-auth/react'
import { UserProvider } from '../context/UserContext'
import { SidebarProvider } from '../context/SidebarContext'
import { useState, useEffect } from 'react'
import ErrorBoundary from './ErrorBoundary'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>
  }

  return (
    <ErrorBoundary>
      <SessionProvider>
        <UserProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </UserProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}