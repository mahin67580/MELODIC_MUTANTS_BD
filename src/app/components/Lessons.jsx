import { FaArrowRightToBracket } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Star } from "lucide-react";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import LessonActionButton from "./LessonActionButton";

export default async function Lessons() {
  const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);
  const data = await lessonCollection
    .find({})
    .sort({ enrolledStudents: -1 }) // Sort by enrolledStudents in descending order
    .limit(6) // Get top 6 most enrolled
    .toArray();

  // Compute Average Rating
  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
    return total / ratings.length;
  };

  return (
    <section id="courses" className="w-full py-3 md:py-6 lg:py-10 ">
      <div className="  px-4 md:px-6 ">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="lg:text-6xl text-4xl   tracking-tighter sm:text-4xl md:text-5xl">
              𝕱𝖊𝖆𝖙𝖚𝖗𝖊𝖉 𝕷𝖊𝖘𝖘𝖔𝖓𝖘
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Discover our most popular music lessons taught by expert instructors
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3 ">
          {data.map((lesson) => {
            const avgRating = getAverageRating(lesson.ratings);
            const roundedRating = Math.round(avgRating);
            //bg-gradient-to-br from-black/10 to-black/5
            return (
              <Card key={lesson._id} className=" group overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={lesson.thumbnail}
                    alt={lesson.instrument}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                      ${lesson.price}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{lesson.instrument}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {lesson.description || `Learn ${lesson.instrument} with expert guidance`}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < roundedRating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({avgRating.toFixed(1)})
                        </span>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {(lesson.enrolledStudents || 0).toLocaleString()} enrolled
                    </Badge>
                  </div>

                  {lesson.level && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Level:</span>
                      <Badge variant="secondary" className="text-xs">
                        {lesson.level}
                      </Badge>
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                    <LessonActionButton lessonId={lesson._id.toString()} />
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* View All Lessons Button */}
        <div className="flex justify-center mt-12">
          <Button asChild size="lg">
            <Link href="/allcourses" className="flex items-center gap-2">
              View All Lessons
              <FaArrowRightToBracket className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Skeleton component for loading state (optional)
export function LessonsSkeleton() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-video w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}