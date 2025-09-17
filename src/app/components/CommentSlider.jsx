"use client"

import { useState } from "react"
import { FaStar, FaUserCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa"

export default function CommentSlider({ ratings }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    if (currentIndex < ratings.length - 1) setCurrentIndex(prev => prev + 1)
  }
  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1)
  }

  return (
    <div id="comment" className=" w-full py-12 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Student Reviews</h2>

        {/* Slider Container */}
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button 
            onClick={prev} 
            className="absolute -left-4 z-10 p-3 bg-white rounded-full shadow-md hover:scale-110 transition disabled:opacity-30"
            disabled={currentIndex === 0}
          >
            <FaChevronLeft className="text-gray-600" />
          </button>

          {/* Slider Track */}
          <div className="flex overflow-hidden w-full">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {ratings.map((rating, index) => (
                <div 
                  key={index} 
                  className="min-w-full md:min-w-[50%] lg:min-w-[33.3%] bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < rating.rating ? "text-yellow-400" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">"{rating.review}"</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center font-medium text-gray-900 gap-1">
                      <FaUserCircle className="text-gray-500 text-lg" />
                      {rating.user}
                    </span>
                    <span className="text-sm text-blue-600 truncate max-w-[150px]">{rating.lessonTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button 
            onClick={next} 
            className="absolute -right-4 z-10 p-3 bg-white rounded-full shadow-md hover:scale-110 transition disabled:opacity-30"
            disabled={currentIndex === ratings.length - 1}
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
