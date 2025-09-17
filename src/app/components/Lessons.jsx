import { FaArrowRightToBracket } from "react-icons/fa6";
import dbConnect, { collectionNamesObj } from "@/lib/dbconnect";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Star } from "lucide-react";

export default async function Lessons() {
  const lessonCollection = dbConnect(collectionNamesObj.lessonCollection);
  const data = await lessonCollection.find({}).limit(6).toArray();

  // Compute Average Rating
  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
    return total / ratings.length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Available Lessons</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((lesson) => {
          const avgRating = getAverageRating(lesson.ratings);

          return (
            <div
              key={lesson._id}
              className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full h-48">
                <Image
                  src={lesson.thumbnail}
                  alt={lesson.instrument}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{lesson.instrument}</h2>
                <p className="text-gray-700">Price: ${lesson.price}</p>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(avgRating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    ({avgRating.toFixed(1)})
                  </span>
                </div>

                <div className="text-sm text-green-600 font-semibold mb-4">
                  {(lesson.enrolledStudents || 0).toLocaleString()} students enrolled
                </div>

                <Link href={`lessons/${lesson._id}`}>
                  <div className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                    <span>View Lesson</span>
                    <FaArrowRightToBracket />
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
