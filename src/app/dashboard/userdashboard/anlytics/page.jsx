"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  BookOpen, Calendar, DollarSign, TrendingUp, Users, Clock, 
  Bookmark, BarChart3, CreditCard, Target
} from 'lucide-react'

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [analyticsData, setAnalyticsData] = useState({
    courses: [],
    bookings: [],
    stats: {},
    loading: true
  })

  useEffect(() => {
    if (session) {
      fetchAnalyticsData()
    }
  }, [session])

  const fetchAnalyticsData = async () => {
    try {
      setAnalyticsData(prev => ({ ...prev, loading: true }))
      
      // Fetch courses and bookings in parallel
      const [coursesRes, bookingsRes] = await Promise.all([
        fetch(`/api/mycourses`),
        fetch(`/api/lesson`)
      ])

      if (!coursesRes.ok || !bookingsRes.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const courses = await coursesRes.json()
      const bookings = await bookingsRes.json()

      // Calculate statistics
      const totalSpent = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0)
      const averageCourseProgress = courses.length > 0 
        ? courses.reduce((sum, course) => sum + (course.progress || 0), 0) / courses.length 
        : 0
      
      // Count bookings by payment method
      const paymentMethods = bookings.reduce((acc, booking) => {
        const method = booking.paymentMethod || 'unknown'
        acc[method] = (acc[method] || 0) + 1
        return acc
      }, {})

      // Count courses by level
      const coursesByLevel = courses.reduce((acc, course) => {
        const level = course.level || 'unknown'
        acc[level] = (acc[level] || 0) + 1
        return acc
      }, {})

      // Prepare data for charts
      const monthlySpendingData = prepareMonthlySpendingData(bookings)
      const courseProgressData = prepareCourseProgressData(courses)
      const paymentMethodData = Object.entries(paymentMethods).map(([name, value]) => ({ name, value }))
      const courseLevelData = Object.entries(coursesByLevel).map(([name, value]) => ({ name, value }))

      setAnalyticsData({
        courses,
        bookings,
        stats: {
          totalCourses: courses.length,
          totalBookings: bookings.length,
          totalSpent,
          averageCourseProgress,
          monthlySpendingData,
          courseProgressData,
          paymentMethodData,
          courseLevelData
        },
        loading: false
      })
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setAnalyticsData(prev => ({ ...prev, loading: false }))
    }
  }

  const prepareMonthlySpendingData = (bookings) => {
    // Group bookings by month and sum spending
    const monthlyData = bookings.reduce((acc, booking) => {
      if (!booking.createdAt) return acc
      
      const date = new Date(booking.createdAt)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
      
      if (!acc[monthYear]) {
        acc[monthYear] = 0
      }
      
      acc[monthYear] += booking.price || 0
      return acc
    }, {})
    
    // Convert to array format for chart
    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount: parseFloat(amount.toFixed(2))
    }))
  }

  const prepareCourseProgressData = (courses) => {
    // Group courses by progress ranges
    const progressRanges = {
      '0-20%': 0,
      '21-40%': 0,
      '41-60%': 0,
      '61-80%': 0,
      '81-100%': 0
    }
    
    courses.forEach(course => {
      const progress = course.progress || 0
      if (progress <= 20) progressRanges['0-20%']++
      else if (progress <= 40) progressRanges['21-40%']++
      else if (progress <= 60) progressRanges['41-60%']++
      else if (progress <= 80) progressRanges['61-80%']++
      else progressRanges['81-100%']++
    })
    
    return Object.entries(progressRanges).map(([name, count]) => ({ name, count }))
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (analyticsData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Learning Analytics</h1>
          
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Courses Enrolled</p>
                <p className="text-2xl font-bold text-gray-800">{analyticsData.stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{analyticsData.stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <DollarSign className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800">${analyticsData.stats.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-800">{analyticsData.stats.averageCourseProgress.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid   gap-8 mb-8">
          {/* Monthly Spending Chart */}
          {/* <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <DollarSign className="mr-2" size={20} />
              Monthly Spending
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analyticsData.stats.monthlySpendingData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div> */}

          {/* Course Progress Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="mr-2" size={20} />
              Course Progress Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.stats.courseProgressData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCard className="mr-2" size={20} />
              Payment Methods
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.stats.paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.stats.paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Courses by Level */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Bookmark className="mr-2" size={20} />
              Courses by Level
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.stats.courseLevelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.stats.courseLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Courses and Bookings */}
        <div className=" ">
          {/* Recent Courses */}
          {/* <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Courses</h2>
            <div className="space-y-4">
              {analyticsData.courses.slice(0, 5).map(course => (
                <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="text-blue-600 mr-3" size={18} />
                    <div>
                      <p className="font-medium text-gray-800">{course.title}</p>
                      <p className="text-sm text-gray-600">{course.level} • {course.progress || 0}% complete</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">${course.price}</div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h2>
            <div className="space-y-4">
              {analyticsData.bookings.slice(0, 5).map(booking => (
                <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="text-green-600 mr-3" size={18} />
                    <div>
                      <p className="font-medium text-gray-800">{booking.lessonTitle}</p>
                      <p className="text-sm text-gray-600">{booking.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">${booking.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}