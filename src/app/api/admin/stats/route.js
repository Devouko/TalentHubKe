import { NextResponse } from 'next/server';
import { stats, gigs, users, orders } from '../../../../lib/data';

export async function GET() {
  try {
    const currentStats = {
      totalUsers: users.length,
      totalGigs: gigs.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      activeGigs: gigs.filter(g => g.isActive).length,
      completedOrders: orders.filter(o => o.status === 'COMPLETED').length,
      pendingOrders: orders.filter(o => o.status === 'PENDING').length,
      averageRating: gigs.reduce((sum, gig) => sum + gig.rating, 0) / gigs.length || 0
    };

    return NextResponse.json(currentStats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}