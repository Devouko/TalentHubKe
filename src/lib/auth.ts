import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { UserType } from '@prisma/client'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export function hasRole(userType: string, allowedRoles: UserType[]) {
  return allowedRoles.includes(userType as UserType)
}

export function isAdmin(userType: string) {
  return userType === 'ADMIN'
}

export function isFreelancer(userType: string) {
  return ['FREELANCER', 'AGENCY'].includes(userType)
}

export function isClient(userType: string) {
  return userType === 'CLIENT'
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session.user
}

export async function requireRole(allowedRoles: UserType[]) {
  const user = await requireAuth()
  if (!hasRole(user.userType, allowedRoles)) {
    throw new Error('Forbidden')
  }
  return user
}

export async function requireAdmin() {
  return await requireRole(['ADMIN'])
}

export async function requireFreelancer() {
  return await requireRole(['FREELANCER', 'AGENCY'])
}