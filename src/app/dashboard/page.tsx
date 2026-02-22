'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardContent from './DashboardContent'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth')
      return
    }

    // Redirect admins to admin dashboard
    if (session.user?.userType === 'ADMIN') {
      router.push('/admin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access the dashboard</p>
          <button 
            onClick={() => router.push('/auth')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return <DashboardContent />
}