import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalArticles,
      totalStations,
      totalPrograms,
      totalUsers,
      totalListeners,
      recentRequests,
      recentShoutouts,
      recentDonations
    ] = await Promise.all([
      query('SELECT COUNT(*) as count FROM articles'),
      query('SELECT COUNT(*) as count FROM stations WHERE is_active = 1'),
      query('SELECT COUNT(*) as count FROM programs WHERE is_active = 1'),
      query('SELECT COUNT(*) as count FROM users'),
      query('SELECT SUM(listener_count) as total FROM stations'),
      query('SELECT COUNT(*) as count FROM song_requests WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'),
      query('SELECT COUNT(*) as count FROM shoutouts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'),
      query('SELECT SUM(amount) as total FROM donations WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)')
    ]);

    const statistics = {
      articles: totalArticles[0]?.count || 0,
      stations: totalStations[0]?.count || 0,
      programs: totalPrograms[0]?.count || 0,
      users: totalUsers[0]?.count || 0,
      listeners: totalListeners[0]?.total || 0,
      weeklyRequests: recentRequests[0]?.count || 0,
      weeklyShoutouts: recentShoutouts[0]?.count || 0,
      monthlyDonations: recentDonations[0]?.total || 0
    };

    return NextResponse.json({ success: true, data: statistics });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
