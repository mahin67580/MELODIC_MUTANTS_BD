"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import Swal from 'sweetalert2'

export default function MyCoursesPage() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const { data: session } = useSession()

    useEffect(() => {
        if (session) {
            fetchMyCourses()
        }
    }, [session])

    const fetchMyCourses = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/mycourses`)
            if (!res.ok) {
                throw new Error('Failed to fetch courses')
            }
            const data = await res.json()
            setCourses(data)
        } catch (error) {
            console.error('Error fetching courses:', error)
            Swal.fire('Error', 'Failed to load your courses', 'error')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen ">
            <div className="">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">𝕸𝖞 𝕮𝖔𝖚𝖗𝖘𝖊𝖘</h1>
                    <span className="text-gray-600">
                        {courses.length} {courses.length === 1 ? 'course' : 'courses'} enrolled
                    </span>
                </div>

                {courses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No courses yet</h2>
                        <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                        <Link 
                            href="/lessons" 
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Link key={course._id} href={`/dashboard/userdashboard/mycourses/${course._id}`}>
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={course.thumbnail || '/placeholder-course.jpg'}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                                            {course.level}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            Instructor : {course.instructor?.name || 'Unknown Instructor'}
                                        </p>
                                        
                                        {/* <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-gray-500">
                                                {course.duration} minutes
                                            </span>
                                            <span className="text-sm font-semibold text-green-600">
                                                ${course.price}
                                            </span>
                                        </div> */}

                            

                                        <div className="mt-4 pt-3 border-t border-gray-100">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full" 
                                                    style={{ width: `${course.progress || 0}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {course.progress || 0}% complete
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}