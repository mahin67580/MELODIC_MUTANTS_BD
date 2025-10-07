// app/dashboard/admindashboard/analytics/page.jsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  BookOpen,
  UserCheck,
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
} from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    averageRating: 0,
  });
  const [courseEnrollments, setCourseEnrollments] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all necessary data
      const [usersRes, instructorsRes, coursesRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/users"), // We'll need to create this
        fetch("/api/instructor"),
        fetch("/api/courses"),
        fetch("/api/bookings") // We'll need to create this
      ]);

      const users = await usersRes.json();
      const instructors = await instructorsRes.json();
      const courses = await coursesRes.json();
      const bookings = await bookingsRes.json();

      // Calculate statistics
      const totalUsers = users.data?.length || 0;
      const totalInstructors = instructors.instructors?.length || 0;
      const totalCourses = courses.data?.length || 0;
      
      const totalEnrollments = courses.data?.reduce((sum, course) => 
        sum + (course.enrolledStudents || 0), 0
      ) || 0;
      
      const totalRevenue = bookings.data?.reduce((sum, booking) => 
        sum + (booking.price || 0), 0
      ) || 0;

      const averageRating = courses.data?.reduce((sum, course) => {
        const courseRatings = course.ratings || [];
        const courseAvg = courseRatings.reduce((avg, rating) => avg + (rating.rating || 0), 0) / (courseRatings.length || 1);
        return sum + courseAvg;
      }, 0) / (courses.data?.length || 1) || 0;

      // Course enrollments data for chart
      const courseEnrollmentsData = courses.data
        ?.map(course => ({
          name: course.title.length > 20 ? course.title.substring(0, 20) + "..." : course.title,
          enrollments: course.enrolledStudents || 0,
          revenue: (course.enrolledStudents || 0) * (course.price || 0),
        }))
        .sort((a, b) => b.enrollments - a.enrollments)
        .slice(0, 5) || [];

      // Revenue data (monthly - mock data for now)
      const monthlyRevenue = generateMonthlyRevenue(bookings.data || []);

      // User growth data (mock data for now)
      const userGrowthData = generateUserGrowthData(users.data || []);

      // Recent activities
      const recentActivitiesData = generateRecentActivities(bookings.data || [], courses.data || []);

      setStats({
        totalUsers,
        totalInstructors,
        totalCourses,
        totalEnrollments,
        totalRevenue,
        averageRating: parseFloat(averageRating.toFixed(1)),
      });

      setCourseEnrollments(courseEnrollmentsData);
      setRevenueData(monthlyRevenue);
      setUserGrowth(userGrowthData);
      setRecentActivities(recentActivitiesData);

    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data generators (you can replace with actual time-based data from your database)
  const generateMonthlyRevenue = (bookings) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 10000) + 5000, // Mock data
    }));
  };

  const generateUserGrowthData = (users) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map(month => ({
      month,
      users: Math.floor(Math.random() * 50) + 10, // Mock data
    }));
  };

  const generateRecentActivities = (bookings, courses) => {
    const activities = [];
    
    // Add recent enrollments
    bookings.slice(0, 5).forEach(booking => {
      activities.push({
        type: "enrollment",
        message: `${booking.name} enrolled in ${booking.lessonTitle}`,
        timestamp: new Date().toISOString(),
        icon: "user",
      });
    });

    // Add new courses
    courses.slice(0, 3).forEach(course => {
      activities.push({
        type: "course",
        message: `New course: ${course.title}`,
        timestamp: course.createdAt,
        icon: "book",
      });
    });

    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);
  };

  const StatCard = ({ title, value, icon: Icon, description, trend }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of Musical Mutants performance and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="All registered users"
          trend={12}
        />
        <StatCard
          title="Total Instructors"
          value={stats.totalInstructors}
          icon={UserCheck}
          description="Active instructors"
          trend={8}
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          description="Published courses"
          trend={15}
        />
        <StatCard
          title="Total Enrollments"
          value={stats.totalEnrollments}
          icon={TrendingUp}
          description="Course enrollments"
          trend={20}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue}`}
          icon={DollarSign}
          description="Total revenue generated"
          trend={18}
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          icon={Star}
          description="Average course rating"
          trend={5}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Course Enrollments Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Top Courses by Enrollments</CardTitle>
            <CardDescription>
              Most popular courses based on student enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseEnrollments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="enrollments" fill="#8884d8" name="Enrollments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Categories */}
        <Card className="lg:col-span-3 col-span-4">
          <CardHeader>
            <CardTitle>Course Distribution</CardTitle>
            <CardDescription>By instrument categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Piano", value: 35 },
                    { name: "Guitar", value: 25 },
                    { name: "Violin", value: 20 },
                    { name: "Drums", value: 15 },
                    { name: "Vocals", value: 5 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: "Piano", value: 35 },
                    { name: "Guitar", value: 25 },
                    { name: "Violin", value: 20 },
                    { name: "Drums", value: 15 },
                    { name: "Vocals", value: 5 },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest actions on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {activity.icon === "user" && <Users className="h-4 w-4 text-blue-500" />}
                  {activity.icon === "book" && <BookOpen className="h-4 w-4 text-green-500" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}