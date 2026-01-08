import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      escrowBalance,
      activeOrders
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'COMPLETED' }
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['PENDING', 'IN_PROGRESS'] } }
      }),
      prisma.order.count({
        where: { status: { in: ['PENDING', 'IN_PROGRESS'] } }
      })
    ]);

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      escrowBalance: escrowBalance._sum.totalAmount || 0,
      activeOrders
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}