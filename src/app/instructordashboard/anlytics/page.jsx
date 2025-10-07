// app/dashboard/instructordashboard/analytics/page.jsx
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
  DollarSign,
  TrendingUp,
  Star,
  Calendar,
  MessageSquare,
  Award,
} from "lucide-react";
import { useSession } from "next-auth/react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function InstructorAnalyticsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalStudents: 0,
    totalReviews: 0,
  });
  const [coursePerformance, setCoursePerformance] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchInstructorAnalytics();
    }
  }, [session]);

  const fetchInstructorAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch instructor's courses
      const coursesRes = await fetch("/api/courses");
      const coursesData = await coursesRes.json();
      
      // Filter courses for current instructor
      const instructorCourses = coursesData.data?.filter(
        course => course.email === session.user.email
      ) || [];

      // Fetch bookings to get enrollment data
      const bookingsRes = await fetch("/api/bookings");
      const bookingsData = await bookingsRes.json();

      // Calculate instructor-specific statistics
      const totalCourses = instructorCourses.length;
      
      const totalEnrollments = instructorCourses.reduce((sum, course) => 
        sum + (course.enrolledStudents || 0), 0
      );

      // Calculate revenue from instructor's courses
      const totalRevenue = instructorCourses.reduce((sum, course) => {
        const courseBookings = bookingsData.data?.filter(
          booking => booking.id === course._id.toString()
        ) || [];
        return sum + courseBookings.reduce((courseSum, booking) => 
          courseSum + (booking.price || 0), 0
        );
      }, 0);

      // Calculate average rating
      const allRatings = instructorCourses.flatMap(course => course.ratings || []);
      const averageRating = allRatings.length > 0 
        ? allRatings.reduce((sum, rating) => sum + (rating.rating || 0), 0) / allRatings.length
        : 0;

      // Get unique students count
      const instructorBookings = bookingsData.data?.filter(booking => 
        instructorCourses.some(course => course._id.toString() === booking.id)
      ) || [];
      const uniqueStudents = new Set(instructorBookings.map(booking => booking.email)).size;

      // Course performance data
      const coursePerformanceData = instructorCourses.map(course => ({
        name: course.title.length > 15 ? course.title.substring(0, 15) + "..." : course.title,
        enrollments: course.enrolledStudents || 0,
        revenue: (course.enrolledStudents || 0) * (course.price || 0),
        rating: course.ratings?.length > 0 
          ? course.ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / course.ratings.length
          : 0,
      })).sort((a, b) => b.enrollments - a.enrollments);

      // Enrollment trend data (mock for now)
      const enrollmentTrend = generateEnrollmentTrend(instructorCourses);

      // Revenue data (mock for now)
      const monthlyRevenue = generateMonthlyRevenue(instructorBookings);

      // Rating distribution
      const ratingDist = calculateRatingDistribution(allRatings);

      // Recent enrollments
      const recentEnrollmentsData = instructorBookings
        .slice(0, 6)
        .map(booking => ({
          studentName: booking.name,
          courseName: booking.lessonTitle,
          date: booking._id ? new Date(parseInt(booking._id.toString().substring(0, 8), 16) * 1000) : new Date(),
          amount: booking.price,
        }));

      setStats({
        totalCourses,
        totalEnrollments,
        totalRevenue,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalStudents: uniqueStudents,
        totalReviews: allRatings.length,
      });

      setCoursePerformance(coursePerformanceData);
      setEnrollmentData(enrollmentTrend);
      setRevenueData(monthlyRevenue);
      setRatingDistribution(ratingDist);
      setRecentEnrollments(recentEnrollmentsData);

    } catch (error) {
      console.error("Error fetching instructor analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data generators
  const generateEnrollmentTrend = (courses) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map(month => ({
      month,
      enrollments: Math.floor(Math.random() * 20) + 5,
    }));
  };

  const generateMonthlyRevenue = (bookings) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 5000) + 1000,
    }));
  };

  const calculateRatingDistribution = (ratings) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    ratings.forEach(rating => {
      const stars = Math.round(rating.rating);
      if (distribution[stars] !== undefined) {
        distribution[stars]++;
      }
    });

    return Object.entries(distribution).map(([stars, count]) => ({
      name: `${stars} Stars`,
      value: count,
      stars: parseInt(stars),
    }));
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

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars
                ? 'text-yellow-400 fill-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Instructor Analytics</h1>
        <p className="text-muted-foreground">
          Track your course performance and student engagement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          description="Your published courses"
          trend={8}
        />
        <StatCard
          title="Total Enrollments"
          value={stats.totalEnrollments}
          icon={Users}
          description="Student enrollments"
          trend={15}
        />
        {/* <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          description="Unique students"
          trend={12}
        /> */}
        {/* <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue}`}
          icon={DollarSign}
          description="Earnings from courses"
          trend={20}
        /> */}
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          icon={Star}
          description="Course ratings average"
          trend={5}
        />
        {/* <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={MessageSquare}
          description="Student reviews received"
          trend={10}
        /> */}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Course Performance */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>
              Your courses ranked by student enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="enrollments" fill="#8884d8" name="Enrollments" />
                <Bar dataKey="revenue" fill="#00C49F" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Student feedback breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enrollment Trends */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Monthly student enrollment patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="enrollments" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Enrollments"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly earnings overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Enrollments & Course Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>Latest student registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnrollments.length > 0 ? (
                recentEnrollments.map((enrollment, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{enrollment.studentName}</p>
                      <p className="text-sm text-muted-foreground">{enrollment.courseName}</p>
                      <p className="text-xs text-muted-foreground">
                        {enrollment.date.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${enrollment.amount}</p>
                      <p className="text-xs text-muted-foreground">Enrolled</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent enrollments
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Ratings Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Course Ratings Summary</CardTitle>
            <CardDescription>Detailed course performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coursePerformance.length > 0 ? (
                coursePerformance.map((course, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium">{course.name}</p>
                      <div className="flex items-center justify-between">
                        <RatingStars rating={course.rating} />
                        <span className="text-sm text-muted-foreground">
                          {course.enrollments} enrollments
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No courses published yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your teaching content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/dashboard/instructordashboard/addcourse"
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <BookOpen className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-medium">Create New Course</p>
                <p className="text-sm text-muted-foreground">Publish a new course</p>
              </div>
            </a>
            <a
              href="/dashboard/instructordashboard/managecourse"
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium">Manage Courses</p>
                <p className="text-sm text-muted-foreground">Edit existing courses</p>
              </div>
            </a>
            <a
              href="/dashboard/instructordashboard/updatebio"
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Award className="h-6 w-6 text-purple-500" />
              <div>
                <p className="font-medium">Update Profile</p>
                <p className="text-sm text-muted-foreground">Edit instructor bio</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}