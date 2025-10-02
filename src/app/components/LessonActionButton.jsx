"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaArrowRightToBracket } from "react-icons/fa6"

export default function LessonActionButton({ lessonId  }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    setLoading(true)
    router.push(`/lessons/${lessonId}`)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-2 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-2 
                 text-sm font-medium transition-colors hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
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
        <>
          <span>View Lesson</span>
          <FaArrowRightToBracket className="w-3 h-3" />
        </>
      )}
    </button>
  )
}
