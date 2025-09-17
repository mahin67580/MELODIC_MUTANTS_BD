"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function RatingForm({ courseId, user }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/lesson/${courseId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, rating, review }),
      })

      if (!res.ok) {
        throw new Error("Failed to submit review")
      }

      setRating(0)
      setReview("")
      router.refresh() // refresh page data
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-lg font-bold mb-4">Leave a Review</h3>

      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            className={star <= rating ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        className="w-full border rounded-md p-3 mb-4"
        rows={4}
      />

      <button
        type="submit"
        disabled={isSubmitting || !rating}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  )
}
