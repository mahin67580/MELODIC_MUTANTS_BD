import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

export default async function LessonDetailsPage({ params }) {
    const { id } = await params

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lesson/${id}`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch lesson: ${res.status}`)
        }

        const lesson = await res.json()

        if (!lesson) {
            return (
                <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-2xl font-bold">Lesson not found</h1>
                </div>
            )
        }

        console.log(lesson);



        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Lesson Content */}
                    <div className="w-full lg:w-2/3 space-y-8">
                        {/* Hero Section */}
                        <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src={lesson.thumbnail || '/placeholder-image.jpg'}
                                alt={lesson.title || 'Lesson image'}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <h1 className="text-2xl lg:text-3xl font-bold text-white">{lesson.title}</h1>
                                <p className="text-gray-200">{lesson.instructor?.name || 'Unknown Instructor'}</p>
                            </div>
                        </div>

                        {/* Video Preview Section */}
                        {/* {lesson.videoPreview && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4">Video Preview</h2>
                                <div className="aspect-w-16 aspect-h-9">
                                    <iframe
                                        src={lesson.videoPreview}
                                        title="Lesson Preview"
                                        className="w-full h-64 lg:h-80 rounded-lg"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )} */}

                        {/* Description Section */}
                        {(lesson.description || lesson.longDescription) && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4">About This Lesson</h2>
                                <p className="text-gray-700 leading-relaxed text-justify">
                                    {lesson.description || lesson.longDescription}
                                </p>
                            </div>
                        )}

                        {/* Syllabus Section (replacing Objectives) */}
                        {lesson.syllabus && lesson.syllabus.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4">Course Syllabus</h2>
                                <ul className="space-y-2">
                                    {lesson.syllabus.map((item, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="text-green-500 mr-2">✓</span>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Downloadables Section */}
                        {lesson.downloadables && lesson.downloadables.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4">Downloadable Resources</h2>
                                <div className="grid grid-cols-1 gap-2">
                                    {lesson.downloadables.map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={item.url || '#'}
                                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            download
                                        >
                                            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-gray-700">{item.name || `Resource ${idx + 1}`}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Instructor Bio Section */}
                        {lesson.instructor?.bio && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4">About the Instructor</h2>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-bold text-xl">
                                                {lesson.instructor.name ? lesson.instructor.name.charAt(0).toUpperCase() : 'I'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{lesson.instructor.name}</h3>
                                        <p className="text-gray-700 mt-2 text-justify">{lesson.instructor.bio}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Schedule Section */}
                        {lesson.scheduledSessions && lesson.scheduledSessions.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4">Scheduled Sessions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {lesson.scheduledSessions.map((session, idx) => (
                                        <div key={idx} className="bg-gray-50 rounded-lg p-4">
                                            <div className="text-sm font-semibold text-gray-600">Session {idx + 1}</div>
                                            <div className="text-lg font-medium text-gray-800">
                                                {new Date(session).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {new Date(session).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Checkout Card */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6 space-y-6">
                            {/* Pricing */}
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">${lesson.price || 0}</div>
                                {lesson.originalPrice && lesson.originalPrice > lesson.price && (
                                    <div className="text-sm text-gray-500 line-through">
                                        ${lesson.originalPrice}
                                    </div>
                                )}
                                <div className="text-sm text-green-600 font-semibold mt-1">
                                    {(lesson.enrolledStudents || 0).toLocaleString()} students enrolled
                                </div>
                            </div>

                      
                            {/* Rating Section */}
                            <div className="flex flex-col items-center justify-center  ">
                                {lesson.ratings?.length > 0 ? (
                                    <>
                                        {/* Average rating calculation */}
                                        {(() => {
                                            const avgRating =
                                                lesson.ratings.reduce((acc, r) => acc + r.rating, 0) /
                                                lesson.ratings.length

                                            const rounded = Math.round(avgRating) // round to nearest star, or use toFixed(1) for decimals

                                            return (
                                                <div className="flex items-center gap-2">
                                                    {/* Stars */}
                                                    <span className="text-yellow-400 text-lg">
                                                        {"★".repeat(rounded)}
                                                        <span className="text-gray-300">
                                                            {"★".repeat(5 - rounded)}
                                                        </span>
                                                    </span>

                                                    {/* Average text */}
                                                    <span className="text-gray-700 font-medium">
                                                        {avgRating.toFixed(0)} / 5
                                                    </span>

                                                    {/* Review count */}
                                                    <span className="text-sm text-gray-500">
                                                        ({lesson.ratings.length} reviews)
                                                    </span>
                                                </div>
                                            )
                                        })()}
                                    </>
                                ) : (
                                    <p className="text-gray-500">No reviews yet.</p>
                                )}
                            </div>








                            {/* Checkout Button */}
                            <Link
                                href={`/chechout/${lesson._id || id}`}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                <span>Enroll Now</span>
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>

                            {/* Lesson Details */}
                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Instrument:</span>
                                    <span className="font-semibold">{lesson.instrument || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Level:</span>
                                    <span className="font-semibold capitalize">{lesson.level || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="font-semibold capitalize">{lesson.category || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Instructor:</span>
                                    <span className="font-semibold">{lesson.instructor?.name || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created:</span>
                                    <span className="font-semibold">
                                        {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            {/* Guarantee */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span className="text-sm text-blue-700">30-day money-back guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.error('Error fetching lesson:', error)
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">Error loading lesson</h1>
                <p className="text-gray-600 mt-2">Please try again later</p>
            </div>
        )
    }
}