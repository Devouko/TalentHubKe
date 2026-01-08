'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UserType } from '@prisma/client'

interface WithAuthProps {
  allowedRoles?: UserType[]
  redirectTo?: string
  children: React.ReactNode
}

export function WithAuth({ 
  allowedRoles, 
  redirectTo = '/auth', 
  children 
}: WithAuthProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (status === 'loading' || isRedirecting) return

    if (!session) {
      setIsRedirecting(true)
      router.replace(redirectTo)
      return
    }

    if (allowedRoles && !allowedRoles.includes(session.user.userType as UserType)) {
      setIsRedirecting(true)
      router.replace('/unauthorized')
      return
    }
  }, [session, status, router, allowedRoles, redirectTo, isRedirecting])

  if (status === 'loading' || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!session) return null

  if (allowedRoles && !allowedRoles.includes(session.user.userType as UserType)) {
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
      <WithAuth allowedRoles={allowedRoles}>
        <Component {...props} />
      </WithAuth>
    )
  }
}