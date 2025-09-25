'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import { Star, Calendar, BookOpen } from 'lucide-react'

export default function CommentSlider({ ratings }) {
 
  const [api, setApi] = useState()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const getInitials = (email) => {
    return email.charAt(0).toUpperCase()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
      />
    ))
  }

  if (!ratings || ratings.length === 0) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <p className="text-gray-500">No reviews yet.</p>
      </div>
    )
  }

  return (
    <div className="w-full  mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="lg:text-5xl text-3xl  tracking-tight">𝕾𝖙𝖚𝖉𝖊𝖓𝖙 𝕽𝖊𝖛𝖎𝖊𝖜𝖘</h2>
        <p className="text-muted-foreground mt-2">
          What our students say about our lessons
        </p>
      </div>

      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {ratings.map((rating, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-2">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Rating Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="https://api.dicebear.com/7.x/micah/svg?gender=male" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(rating.user)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium ">
                            {rating.user.split('@')[0]}
                          </p>
                          <div className="flex items-center space-x-1">
                            {renderStars(rating.rating)}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">
                          {formatDate(rating.createdAt)}
                        </span>
                      </Badge>
                    </div>

                    {/* Review Text */}
                    <div className="flex-1 mb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        "{rating.review}"
                      </p>
                    </div>

                    {/* Lesson Info */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">
                          From Lesson:
                        </span>
                      </div>
                      <p className="text-sm font-semibold line-clamp-2">
                        {rating.lessonTitle}
                      </p>
                      {/* {rating.lessonThumbnail && (
                        <div className="mt-2 rounded-md overflow-hidden">
                          <img
                            src={rating.lessonThumbnail}
                            alt={rating.lessonTitle}
                            className="w-full h-20 object-cover"
                          />
                        </div>
                      )} */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center mt-6 space-x-4">
          <CarouselPrevious className="relative static -translate-y-0" />
          <div className="flex space-x-2">
            {Array.from({ length: count }).map((_, index) => (
              <Button
                key={index}
                variant={current === index ? "default" : "outline"}
                className="h-2 w-2 p-0 rounded-full"
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
          <CarouselNext className="relative static -translate-y-0" />
        </div>
      </Carousel>

      {/* Slide Indicator */}
      {/* <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Slide {current + 1} of {count}
        </p>
      </div> */}
    </div>
  )
}