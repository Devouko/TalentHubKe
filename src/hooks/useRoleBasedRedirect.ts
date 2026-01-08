'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useRoleBasedRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading' || !session) return

    const userType = session.user.userType

    switch (userType) {
      case 'ADMIN':
        router.replace('/admin')
        break
      case 'FREELANCER':
      case 'AGENCY':
        router.replace('/seller-dashboard')
        break
      case 'CLIENT':
      default:
        router.replace('/dashboard')
        break
    }
  }, [session, status, router])

  return { session, status }
}