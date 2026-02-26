import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type } = await request.json()

    if (type === 'manual') {
      // Create manual backup
      const backup = await prisma.systemBackup.create({
        data: {
          type: 'MANUAL',
          status: 'COMPLETED',
          size: Math.floor(Math.random() * 1000000), // Simulated size
          createdBy: session.user.id
        }
      })

      return NextResponse.json({ success: true, backup })
    }

    return NextResponse.json({ error: 'Invalid backup type' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const backups = await prisma.systemBackup.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        createdByUser: { select: { name: true, email: true } }
      }
    })

    return NextResponse.json({ backups })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch backups' }, { status: 500 })
  }
}
