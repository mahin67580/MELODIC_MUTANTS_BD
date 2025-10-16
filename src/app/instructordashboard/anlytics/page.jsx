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
  Video,
  Download,
  Clock,
  BarChart3,
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
    totalVideos: 0,
    totalResources: 0,
    totalMilestones: 0,
    totalModules: 0,
  });
  const [coursePerformance, setCoursePerformance] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchInstructorAnalytics();
    }
  }, [session]);

  const fetchInstructorAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all courses
      const coursesRes = await fetch("/api/courses");
      const coursesData = await coursesRes.json();

      // Filter courses for current instructor
      const instructorCourses = coursesData.data?.filter(
        course => course.email === session.user.email
      ) || [];

      console.log("Instructor courses:", instructorCourses);

      // Calculate comprehensive statistics
      const totalCourses = instructorCourses.length;

      const totalEnrollments = instructorCourses.reduce((sum, course) =>
        sum + (course.enrolledStudents || 0), 0
      );

      // Calculate potential revenue (price × enrollments)
      const totalRevenue = instructorCourses.reduce((sum, course) =>
        sum + ((course.price || 0) * (course.enrolledStudents || 0)), 0
      );

      // Calculate average rating and collect all ratings
      const allRatings = instructorCourses.flatMap(course => course.ratings || []);
      const averageRating = allRatings.length > 0
        ? allRatings.reduce((sum, rating) => sum + (rating.rating || 0), 0) / allRatings.length
        : 0;

      // Calculate content metrics
      const totalVideos = instructorCourses.reduce((sum, course) => {
        const courseVideos = course.milestones?.reduce((milestoneSum, milestone) =>
          milestoneSum + (milestone.modules?.length || 0), 0
        ) || 0;
        return sum + courseVideos;
      }, 0);

      const totalResources = instructorCourses.reduce((sum, course) =>
        sum + (course.resources?.downloadables?.length || 0), 0
      );

      const totalMilestones = instructorCourses.reduce((sum, course) =>
        sum + (course.milestones?.length || 0), 0
      );

      const totalModules = instructorCourses.reduce((sum, course) => {
        const courseModules = course.milestones?.reduce((moduleSum, milestone) =>
          moduleSum + (milestone.modules?.length || 0), 0
        ) || 0;
        return sum + courseModules;
      }, 0);

      // Course performance data
      const coursePerformanceData = instructorCourses.map(course => {
        const courseRating = course.ratings?.length > 0
          ? course.ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / course.ratings.length
          : 0;

        const courseVideos = course.milestones?.reduce((sum, milestone) =>
          sum + (milestone.modules?.length || 0), 0
        ) || 0;

        return {
          name: course.title.length > 15 ? course.title.substring(0, 15) + "..." : course.title,
          fullName: course.title,
          enrollments: course.enrolledStudents || 0,
          revenue: (course.enrolledStudents || 0) * (course.price || 0),
          rating: courseRating,
          videos: courseVideos,
          price: course.price || 0,
          level: course.level,
          instrument: course.instrument,
        };
      }).sort((a, b) => b.enrollments - a.enrollments);

      // Enrollment trend data based on course creation dates
      const enrollmentTrend = generateEnrollmentTrend(instructorCourses);

      // Revenue data based on course performance
      const monthlyRevenue = generateMonthlyRevenue(instructorCourses);

      // Rating distribution
      const ratingDist = calculateRatingDistribution(allRatings);

      // Recent activity (course updates, new ratings, etc.)
      const recentActivityData = generateRecentActivity(instructorCourses);

      // Detailed course information for the summary card
      const courseDetailsData = instructorCourses.map(course => {
        const courseRating = course.ratings?.length > 0
          ? course.ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / course.ratings.length
          : 0;

        const totalVideos = course.milestones?.reduce((sum, milestone) =>
          sum + (milestone.modules?.length || 0), 0
        ) || 0;

        const totalResources = course.resources?.downloadables?.length || 0;

        return {
          id: course._id,
          title: course.title,
          rating: courseRating,
          enrollments: course.enrolledStudents || 0,
          price: course.price || 0,
          level: course.level,
          instrument: course.instrument,
          videos: totalVideos,
          resources: totalResources,
          milestones: course.milestones?.length || 0,
          createdAt: course.createdAt,
          ratings: course.ratings || [],
        };
      });

      setStats({
        totalCourses,
        totalEnrollments,
        totalRevenue,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalStudents: totalEnrollments, // Using enrollments as student count
        totalReviews: allRatings.length,
        totalVideos,
        totalResources,
        totalMilestones,
        totalModules,
      });

      setCoursePerformance(coursePerformanceData);
      setEnrollmentData(enrollmentTrend);
      setRevenueData(monthlyRevenue);
      setRatingDistribution(ratingDist);
      setRecentActivity(recentActivityData);
      setCourseDetails(courseDetailsData);

    } catch (error) {
      console.error("Error fetching instructor analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate enrollment trend based on course creation months
  const generateEnrollmentTrend = (courses) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return months.map(month => {
      const monthCourses = courses.filter(course => {
        if (!course.createdAt) return false;
        const courseDate = new Date(course.createdAt);
        return courseDate.toLocaleString('default', { month: 'short' }) === month;
      });
      
      const enrollments = monthCourses.reduce((sum, course) => 
        sum + (course.enrolledStudents || 0), 0
      );
      
      return {
        month,
        enrollments,
        courses: monthCourses.length,
      };
    });
  };

  // Generate revenue data based on course performance
  const generateMonthlyRevenue = (courses) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return months.map(month => {
      const monthCourses = courses.filter(course => {
        if (!course.createdAt) return false;
        const courseDate = new Date(course.createdAt);
        return courseDate.toLocaleString('default', { month: 'short' }) === month;
      });
      
      const revenue = monthCourses.reduce((sum, course) => 
        sum + ((course.price || 0) * (course.enrolledStudents || 0)), 0
      );
      
      return {
        month,
        revenue,
      };
    });
  };

  // Calculate rating distribution
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

  // Generate recent activity from course data
  const generateRecentActivity = (courses) => {
    const activities = [];
    
    courses.forEach(course => {
      // Add course creation activity
      activities.push({
        type: 'course_created',
        title: `Created course: ${course.title}`,
        date: new Date(course.createdAt),
        courseName: course.title,
      });

      // Add rating activities
      if (course.ratings) {
        course.ratings.forEach(rating => {
          activities.push({
            type: 'new_rating',
            title: `New ${rating.rating}★ rating for ${course.title}`,
            date: new Date(rating.createdAt),
            courseName: course.title,
            rating: rating.rating,
            review: rating.review,
          });
        });
      }
    });

    // Sort by date and return latest 6
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
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
            className={`h-4 w-4 ${i < fullStars
              ? 'text-yellow-400 fill-yellow-400'
              : i === fullStars && hasHalfStar
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
              }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating.toFixed(1)})</span>
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

      {/* Comprehensive Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          description="Student enrollments across all courses"
          trend={15}
        />
        <StatCard
          title="Potential Revenue"
          value={`$${stats.totalRevenue}`}
          icon={DollarSign}
          description="Based on enrollments and pricing"
          trend={20}
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          icon={Star}
          description="Across all courses and reviews"
          trend={5}
        />
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={MessageSquare}
          description="Student reviews received"
          trend={10}
        />
        <StatCard
          title="Total Videos"
          value={stats.totalVideos}
          icon={Video}
          description="Teaching videos uploaded"
          trend={25}
        />
        <StatCard
          title="Total Resources"
          value={stats.totalResources}
          icon={Download}
          description="Downloadable materials"
          trend={12}
        />
        <StatCard
          title="Course Modules"
          value={stats.totalModules}
          icon={BarChart3}
          description="Learning modules created"
          trend={18}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Course Performance */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>
              Your courses ranked by student enrollments and revenue potential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue') return [`$${value}`, 'Revenue'];
                    if (name === 'enrollments') return [value, 'Enrollments'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="enrollments" fill="#8884d8" name="Enrollments" />
                <Bar yAxisId="right" dataKey="revenue" fill="#00C49F" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Student feedback breakdown across all courses</CardDescription>
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
            <CardDescription>Monthly student enrollment patterns based on course creation</CardDescription>
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
                <Line
                  type="monotone"
                  dataKey="courses"
                  stroke="#00C49F"
                  strokeWidth={2}
                  name="Courses Created"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Revenue Potential</CardTitle>
            <CardDescription>Monthly earnings potential based on course performance</CardDescription>
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

      {/* Recent Activity & Course Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest course updates and student interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-0 last:pb-0">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'course_created' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {activity.type === 'course_created' ? <BookOpen className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString()}
                      </p>
                      {activity.review && (
                        <p className="text-xs text-muted-foreground italic">"{activity.review}"</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Details Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details Summary</CardTitle>
            <CardDescription>Comprehensive overview of all your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseDetails.length > 0 ? (
                courseDetails.map((course, index) => (
                  <div key={course.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{course.title}</h4>
                      <span className="text-sm font-medium">${course.price}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <RatingStars rating={course.rating} />
                      <span className="text-sm text-muted-foreground">
                        {course.enrollments} enrollments
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Video className="h-3 w-3" />
                        <span>{course.videos} videos</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{course.resources} resources</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-3 w-3" />
                        <span>{course.milestones} milestones</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {course.instrument}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {course.level}
                      </span>
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
    </div>
  );
}