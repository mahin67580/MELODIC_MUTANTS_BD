
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import { ObjectId } from "mongodb";
import { RatingForm } from "@/components/forms/RatingForm";
import VideoPlayer from "../component/VideoPlayer";

async function getCourseData(courseId, userEmail) {
    try {
        const bookingCollection = await dbConnect(
            collectionNamesObj.bookingCollection
        );
        const lessonCollection = await dbConnect(
            collectionNamesObj.lessonCollection
        );

        // Check if user has purchased this course
        const booking = await bookingCollection.findOne({
            email: userEmail,
            id: courseId,
        });

        if (!booking) {
            return null;
        }

        // Convert courseId to ObjectId for querying lessons collection
        let objectId;
        try {
            objectId = new ObjectId(courseId);
        } catch (error) {
            console.error("Invalid course ID:", courseId);
            return null;
        }

        // Get course details
        const course = await lessonCollection.findOne({ _id: objectId });

        if (!course) {
            return null;
        }

        return course;
    } catch (error) {
        console.error("Error fetching course data:", error);
        return null;
    }
}

export default async function CourseDetailPage({ params }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Please sign in to view this course
                    </h1>
                    <Link
                        href="/login"
                        className="text-blue-600 hover:underline mt-4 inline-block"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const course = await getCourseData(id, session.user.email);

    console.log(course);

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Course not found</h1>
                    <p className="text-gray-600 mt-2">
                        You may not have purchased this course
                    </p>
                    <Link
                        href="/lessons"
                        className="text-blue-600 hover:underline mt-4 inline-block"
                    >
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link
                                href="/mycourses"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                My Courses
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-500">{course.title}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {/* Course Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/3">
                            <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                <Image
                                    src={course.thumbnail || "/placeholder-course.jpg"}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="lg:w-2/3">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                {course.title}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                by {course.instructor?.name || "Unknown Instructor"}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {course.level}
                                </div>
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    {course.category}
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-800 mb-2">
                                    What you'll learn
                                </h3>
                                <ul className="flex justify-evenly flex-wrap">
                                    {course.syllabus?.map((item, index) => (
                                        <li className="btn" key={index}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Video Player */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">Course Content</h2>
                            <VideoPlayer
                                pasCourses={course.milestones}
                                modules={course.milestones.flatMap(m => m.modules)}
                            />
                        </div>

                        {/* Milestones Accordion */}


                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">Description</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {course.longDescription ||
                                    course.description ||
                                    "No description available."}
                            </p>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">Student Reviews</h2>

                            {course.ratings?.length > 0 ? (
                                <div className="space-y-4">
                                    {course.ratings.map((r, idx) => (
                                        <div key={idx} className="border-b pb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{r.user}</span>
                                                <span className="text-yellow-400">
                                                    {"★".repeat(r.rating)}{" "}
                                                    <span className="text-gray-300">
                                                        {"★".repeat(5 - r.rating)}
                                                    </span>
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mt-1">{r.review}</p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(r.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No reviews yet.</p>
                            )}

                            <RatingForm
                                courseId={course._id.toString()}
                                user={session.user.email}
                            />
                        </div>

                        {/* Instructor */}
                        {course.instructor && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4">Instructor</h2>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-bold text-xl">
                                                {course.instructor.name
                                                    ? course.instructor.name.charAt(0).toUpperCase()
                                                    : "I"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">
                                            {course.instructor.name}
                                        </h3>
                                        <p className="text-gray-600 mt-2">{course.instructor.bio}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6 space-y-6">
                            <h3 className="text-lg font-bold">Course Progress</h3>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                                    style={{ width: "25%" }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-600">25% complete</p>

                            <div className="pt-4 border-t border-gray-200">
                                <h4 className="font-semibold mb-3">Course Materials</h4>
                                {course.resources.downloadables?.length > 0 ? (
                                    <div className="space-y-2">
                                        {course.resources.downloadables.map((item, index) => (
                                            <a
                                                key={index}
                                                href={item.url || "#"}
                                                download
                                                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-blue-600 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                <span className="text-sm text-gray-700">
                                                    {item.name || `Resource ${index + 1}`}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No downloadable materials available
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <Link
                                    href={`/lessons/${course._id}`}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    Continue Learning
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
