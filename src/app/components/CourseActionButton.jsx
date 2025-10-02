"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CourseActionButton({ course }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    setLoading(true)
    router.push(`/dashboard/userdashboard/mycourses/${course._id}`)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center
        ${course.progress > 0
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-gray-100 hover:bg-gray-200 text-gray-800"}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        <span>{course.progress > 0 ? "Continue Learning" : "Start Learning"}</span>
      )}
    </button>
  )
}
