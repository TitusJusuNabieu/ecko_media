'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayoutWrapper from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Radio,
  Newspaper,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  DollarSign,
  MessageSquare,
  Heart,
  Mic2,
  Activity,
  Eye,
  Loader2,
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Statistics {
  articles: number;
  stations: number;
  programs: number;
  users: number;
  listeners: number;
  weeklyRequests: number;
  weeklyShoutouts: number;
  monthlyDonations: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (data.success) {
        setUser(data.data.user);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/statistics');
      const data = await res.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayoutWrapper>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayoutWrapper>
    );
  }

  const statCards = [
    {
      title: 'Active Listeners',
      value: stats?.listeners || 0,
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Articles',
      value: stats?.articles || 0,
      change: '+8.2%',
      trend: 'up',
      icon: Newspaper,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Monthly Donations',
      value: `$${stats?.monthlyDonations || 0}`,
      change: '+23.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Weekly Requests',
      value: stats?.weeklyRequests || 0,
      change: '-3.4%',
      trend: 'down',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Stations',
      description: 'Add, edit or remove radio stations',
      icon: Radio,
      href: '/admin/stations',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Content Management',
      description: 'Manage articles and blog posts',
      icon: Newspaper,
      href: '/admin/articles',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Programs',
      description: 'Add and edit broadcast programs',
      icon: Mic2,
      href: '/admin/programs',
      color: 'from-purple-500 to-purple-300',
    },
  ];

  return (
    <AdminLayoutWrapper>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || 'Admin'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with Ecko Media today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <Card key={i} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
            </Card>
          ))}
        </div>

        {/* Additional Stats Row */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
              <Radio className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.stations || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Broadcasting live</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.programs || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Weekly Shoutouts</CardTitle>
              <Heart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.weeklyShoutouts || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Received this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Quick Actions</h2>
              <p className="text-muted-foreground">Frequently used management tools</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <Card className="group cursor-pointer border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {action.title}
                    </CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Streaming Service</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Database</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">API Server</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                  Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayoutWrapper>
  );
}
