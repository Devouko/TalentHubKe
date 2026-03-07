import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.security_settings.findFirst() || {
      autoBackupEnabled: true,
      backupFrequency: 'DAILY',
      maxLoginAttempts: 5,
      sessionTimeout: 120,
      twoFactorRequired: false,
      passwordMinLength: 8
    }

    return NextResponse.json({ settings })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const settings = await prisma.security_settings.upsert({
      where: { id: 'default' },
      update: { ...data, updatedAt: new Date() },
      create: { id: 'default', ...data, updatedAt: new Date() }
    })

    await prisma.system_logs.create({
      data: {
        id: crypto.randomUUID(),
        type: 'SECURITY',
        message: 'Security settings updated',
        details: data,
        userId: session.user.id
      }
    })

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
