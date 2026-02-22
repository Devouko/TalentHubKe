import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  return { session, user: session.user }
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  if (session.user.userType !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  return { session, user: session.user }
}

export function handleApiError(error: any) {
  console.error('API Error:', error)
  
  if (error.name === 'ZodError') {
    return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
  }
  
  if (error.code === 'P2002') {
    return NextResponse.json({ error: 'Duplicate entry' }, { status: 400 })
  }
  
  if (error.code === 'P2025') {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }
  
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}
