import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalArticles,
      totalStations,
      totalPrograms,
      totalUsers,
      listenerAgg,
      weeklyRequests,
      weeklyShoutouts,
      monthlyDonations,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.station.count({ where: { isActive: true } }),
      prisma.program.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.station.aggregate({ _sum: { listenerCount: true } }),
      prisma.songRequest.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.shoutout.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        articles: totalArticles,
        stations: totalStations,
        programs: totalPrograms,
        users: totalUsers,
        listeners: listenerAgg._sum.listenerCount || 0,
        weeklyRequests,
        weeklyShoutouts,
        monthlyDonations: monthlyDonations._sum.amount || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
