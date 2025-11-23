'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity,
  Users,
  Code,
  Zap,
  Clock,
  AlertCircle,
  TrendingUp,
  Server,
  RefreshCw,
  Database,
  CreditCard,
} from 'lucide-react';

interface AnalyticsData {
  range: string;
  startDate: string;
  endDate: string;
  realtime: {
    overview: {
      uptime: number;
      totalRequests: number;
      totalErrors: number;
      errorRate: number;
      activeUsers: number;
      requestsPerMinute: number;
    };
    topEndpoints: Array<{
      endpoint: string;
      count: number;
      avgLatency: number;
      errorRate: number;
    }>;
    slowestEndpoints: Array<{
      endpoint: string;
      avgLatency: number;
      count: number;
    }>;
    featureUsage: Array<{
      feature: string;
      totalUses: number;
      uniqueUsers: number;
    }>;
  };
  database: {
    users: { total: number; activeInPeriod: number };
    challenges: { total: number };
    submissions: { total: number; passed: number; failed: number };
    interviews: { total: number; completed: number; inProgress: number };
    subscriptions: { total: number; breakdown: Record<string, number> };
  };
  recentActivity: {
    submissions: Array<any>;
    signups: Array<any>;
  };
  system: {
    rateLimiter: { type: string; configured: boolean; healthy: boolean };
    nodeEnv: string;
    serverTime: string;
  };
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('24h');
  const [lastRefresh, setLastRefresh] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Set mounted state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/analytics?range=${range}`);

      if (response.status === 403) {
        setError('Admin access required. Contact support if you need access.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const analyticsData = await response.json();
      setData(analyticsData);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time product metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchAnalytics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Last refresh indicator */}
      <p className="text-sm text-muted-foreground">
        Last updated: {mounted ? lastRefresh || 'Loading...' : 'Loading...'}
      </p>

      {loading && !data ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : data ? (
        <>
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.realtime.overview.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {data.database.users.total} total users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Requests/min</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.realtime.overview.requestsPerMinute.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(data.realtime.overview.totalRequests)} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  data.realtime.overview.errorRate > 5 ? 'text-red-500' :
                  data.realtime.overview.errorRate > 1 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {data.realtime.overview.errorRate.toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.realtime.overview.totalErrors} errors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatUptime(data.realtime.overview.uptime)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Since server start
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Database Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.database.submissions.total}</div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="default" className="bg-green-500">
                    {data.database.submissions.passed} passed
                  </Badge>
                  <Badge variant="destructive">
                    {data.database.submissions.failed} failed
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.database.interviews.total}</div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="default" className="bg-green-500">
                    {data.database.interviews.completed} done
                  </Badge>
                  <Badge variant="secondary">
                    {data.database.interviews.inProgress} active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.database.subscriptions.total}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(data.database.subscriptions.breakdown).map(([tier, count]) => (
                    <Badge key={tier} variant="outline" className="text-xs">
                      {tier}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Challenges</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.database.challenges.total}</div>
                <p className="text-xs text-muted-foreground">
                  Total available
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Endpoints & Slow Endpoints */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top API Endpoints
                </CardTitle>
                <CardDescription>Most requested endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.realtime.topEndpoints.slice(0, 5).map((ep, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="font-mono truncate max-w-[200px]">{ep.endpoint}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{ep.count}</Badge>
                        <span className="text-muted-foreground text-xs">
                          {ep.avgLatency.toFixed(0)}ms
                        </span>
                      </div>
                    </div>
                  ))}
                  {data.realtime.topEndpoints.length === 0 && (
                    <p className="text-muted-foreground text-sm">No data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Slowest Endpoints
                </CardTitle>
                <CardDescription>Endpoints with highest latency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.realtime.slowestEndpoints.slice(0, 5).map((ep, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="font-mono truncate max-w-[200px]">{ep.endpoint}</span>
                      <Badge variant={ep.avgLatency > 1000 ? 'destructive' : 'secondary'}>
                        {ep.avgLatency.toFixed(0)}ms
                      </Badge>
                    </div>
                  ))}
                  {data.realtime.slowestEndpoints.length === 0 && (
                    <p className="text-muted-foreground text-sm">No data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rate Limiter:</span>
                  <Badge variant={data.system.rateLimiter.healthy ? 'default' : 'destructive'}>
                    {data.system.rateLimiter.type}
                    {data.system.rateLimiter.healthy ? ' (healthy)' : ' (unhealthy)'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Environment:</span>
                  <Badge variant="outline">{data.system.nodeEnv}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Server Time:</span>
                  <span className="text-sm">
                    {new Date(data.system.serverTime).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.recentActivity.signups.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between text-sm">
                    <span>{user.username || 'Anonymous'}</span>
                    <span className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
                {data.recentActivity.signups.length === 0 && (
                  <p className="text-muted-foreground text-sm">No recent signups</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
