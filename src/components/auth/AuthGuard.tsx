'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { UserType } from '@prisma/client'

interface AuthGuardProps {
  allowedRoles?: UserType[]
  children: React.ReactNode
}

export function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.replace('/auth')
      return
    }

    if (session && allowedRoles && !allowedRoles.includes(session.user.userType as UserType)) {
      router.replace('/unauthorized')
      return
    }
  }, [session, status, router, allowedRoles])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  if (session && allowedRoles && !allowedRoles.includes(session.user.userType as UserType)) {
    return null
  }

  return <>{children}</>
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: UserType[]
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard allowedRoles={allowedRoles}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}