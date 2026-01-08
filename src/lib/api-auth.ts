import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { UserType } from '@prisma/client'

export async function withAuth(
  handler: (req: NextRequest, context: { user: any }) => Promise<NextResponse>,
  allowedRoles?: UserType[]
) {
  return async (req: NextRequest) => {
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (allowedRoles && !allowedRoles.includes(token.userType as UserType)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      return handler(req, { user: token })
    } catch (error) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
}

export function requireAdmin() {
  return (handler: Function) => withAuth(handler, ['ADMIN'])
}

export function requireFreelancer() {
  return (handler: Function) => withAuth(handler, ['FREELANCER', 'AGENCY'])
}

export function requireClient() {
  return (handler: Function) => withAuth(handler, ['CLIENT'])
}