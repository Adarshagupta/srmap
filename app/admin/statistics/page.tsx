"use client";

import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Users, CalendarDays, Bell, TrendingUp, UserPlus, Activity } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface Statistics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalEvents: number;
  upcomingEvents: number;
  totalNotifications: number;
  usersByDepartment: {
    [key: string]: number;
  };
  usersByYear: {
    [key: string]: number;
  };
  usersByBatch: {
    [key: string]: number;
  };
  recentActivity: {
    id: string;
    type: string;
    description: string;
    timestamp: any;
  }[];
}

const TIME_RANGES = ['7d', '30d', '90d'];
const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const YEARS = ['1', '2', '3', '4'];
const BATCHES = ['2020', '2021', '2022', '2023'];

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const { toast } = useToast();

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  async function fetchStatistics() {
    try {
      setLoading(true);

      const now = new Date();
      const daysToSubtract = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = startOfDay(subDays(now, daysToSubtract));

      // Fetch users statistics
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const totalUsers = usersSnapshot.size;

      const activeUsersQuery = query(
        usersRef,
        where('lastLogin', '>=', startDate)
      );
      const activeUsersSnapshot = await getDocs(activeUsersQuery);
      const activeUsers = activeUsersSnapshot.size;

      const newUsersQuery = query(
        usersRef,
        where('createdAt', '>=', startDate)
      );
      const newUsersSnapshot = await getDocs(newUsersQuery);
      const newUsers = newUsersSnapshot.size;

      // Fetch events statistics
      const eventsRef = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsRef);
      const totalEvents = eventsSnapshot.size;

      const upcomingEventsQuery = query(
        eventsRef,
        where('date', '>=', now)
      );
      const upcomingEventsSnapshot = await getDocs(upcomingEventsQuery);
      const upcomingEvents = upcomingEventsSnapshot.size;

      // Fetch notifications statistics
      const notificationsRef = collection(db, 'notifications');
      const notificationsSnapshot = await getDocs(notificationsRef);
      const totalNotifications = notificationsSnapshot.size;

      // Calculate user distribution
      const usersByDepartment: { [key: string]: number } = {};
      const usersByYear: { [key: string]: number } = {};
      const usersByBatch: { [key: string]: number } = {};

      usersSnapshot.docs.forEach(doc => {
        const user = doc.data();
        
        if (user.department) {
          usersByDepartment[user.department] = (usersByDepartment[user.department] || 0) + 1;
        }
        
        if (user.year) {
          usersByYear[user.year] = (usersByYear[user.year] || 0) + 1;
        }
        
        if (user.batch) {
          usersByBatch[user.batch] = (usersByBatch[user.batch] || 0) + 1;
        }
      });

      // Fetch recent activity
      const recentActivity = [
        ...newUsersSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'new_user',
          description: `New user registered: ${doc.data().name}`,
          timestamp: doc.data().createdAt,
        })),
        // Add more activity types here
      ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

      setStatistics({
        totalUsers,
        activeUsers,
        newUsers,
        totalEvents,
        upcomingEvents,
        totalNotifications,
        usersByDepartment,
        usersByYear,
        usersByBatch,
        recentActivity,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch statistics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!statistics) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Statistics</h1>
          <p className="text-muted-foreground">
            Overview of system statistics and analytics
          </p>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGES.map((range) => (
              <SelectItem key={range} value={range}>
                Last {range === '7d' ? '7 days' : range === '30d' ? '30 days' : '90 days'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <h3 className="text-2xl font-bold">{statistics.totalUsers}</h3>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="flex items-center text-green-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              {Math.round((statistics.activeUsers / statistics.totalUsers) * 100)}%
            </div>
            <span className="text-muted-foreground ml-2">active users</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                New Users
              </p>
              <h3 className="text-2xl font-bold">{statistics.newUsers}</h3>
            </div>
            <UserPlus className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">
              in the last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Users
              </p>
              <h3 className="text-2xl font-bold">{statistics.activeUsers}</h3>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">
              in the last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Events
              </p>
              <h3 className="text-2xl font-bold">{statistics.totalEvents}</h3>
            </div>
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">
              {statistics.upcomingEvents} upcoming
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Notifications
              </p>
              <h3 className="text-2xl font-bold">{statistics.totalNotifications}</h3>
            </div>
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">
              total notifications sent
            </span>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold">Users by Department</h3>
            <p className="text-sm text-muted-foreground">
              Distribution of users across departments
            </p>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEPARTMENTS.map((department) => (
                  <TableRow key={department}>
                    <TableCell>{department}</TableCell>
                    <TableCell>{statistics.usersByDepartment[department] || 0}</TableCell>
                    <TableCell>
                      {Math.round(((statistics.usersByDepartment[department] || 0) / statistics.totalUsers) * 100)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold">Users by Year</h3>
            <p className="text-sm text-muted-foreground">
              Distribution of users across years
            </p>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {YEARS.map((year) => (
                  <TableRow key={year}>
                    <TableCell>Year {year}</TableCell>
                    <TableCell>{statistics.usersByYear[year] || 0}</TableCell>
                    <TableCell>
                      {Math.round(((statistics.usersByYear[year] || 0) / statistics.totalUsers) * 100)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold">Users by Batch</h3>
            <p className="text-sm text-muted-foreground">
              Distribution of users across batches
            </p>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BATCHES.map((batch) => (
                  <TableRow key={batch}>
                    <TableCell>{batch}</TableCell>
                    <TableCell>{statistics.usersByBatch[batch] || 0}</TableCell>
                    <TableCell>
                      {Math.round(((statistics.usersByBatch[batch] || 0) / statistics.totalUsers) * 100)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">
            Latest system activity and events
          </p>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics.recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <Badge variant="secondary">
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>
                    {format(activity.timestamp.toDate(), 'PPp')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
} 