import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export type UserRole = 'ADMIN' | 'CLIENT' | 'FREELANCER' | 'AGENCY'

export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  const message = error instanceof Error ? error.message : String(error)
  
  if (message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function requireRole(role: UserRole | UserRole[]) {
  const session = await requireAuth()
  const roles = Array.isArray(role) ? role : [role]
  
  if (!roles.includes(session.user.userType as UserRole)) {
    throw new Error('Forbidden')
  }
  return session
}

export async function requireAdmin() {
  return await requireRole('ADMIN')
}

export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}