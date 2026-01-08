'use client'

import { useSession } from 'next-auth/react'
import { UserType } from '@prisma/client'

export function useAuth() {
  const { data: session, status } = useSession()

  const isLoading = status === 'loading'
  const isAuthenticated = !!session?.user
  const user = session?.user

  const hasRole = (roles: UserType[]) => {
    if (!user?.userType) return false
    return roles.includes(user.userType as UserType)
  }

  const isAdmin = () => user?.userType === 'ADMIN'
  const isFreelancer = () => ['FREELANCER', 'AGENCY'].includes(user?.userType || '')
  const isClient = () => user?.userType === 'CLIENT'
  const isVerified = () => user?.isVerified === true

  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    isAdmin,
    isFreelancer,
    isClient,
    isVerified,
    userType: user?.userType as UserType,
    sellerStatus: user?.sellerStatus
  }
}