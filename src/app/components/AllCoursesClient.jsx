"use client";
import React, { useState } from "react";
import { Search, Filter, Star } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AllCoursesClient({ courses }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    // console.log(courses);
    // Instrument options
    const instrumentOptions = [
        "Acoustic Guitar",
        "Electric Guitar",
        "Classical Guitar",
        "Bass Guitar",
        "Piano / Keyboard",
        "Drums / Percussion",
        "Violin",
        "Cello",
        "Flute",
        "Saxophone",
        "Clarinet",
        "Trumpet",
        "Trombone",
        "Vocals (Singing)",
        "Ukulele",
        "Harmonica",
        "Banjo",
        "Tabla / Hand Drums",
        "Digital Music Production"
    ];

    // Filter & Search Logic
    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesFilter =
            filter === "All" ? true : course.instrument === filter;
        return matchesSearch && matchesFilter;
    });

    // Compute Average Rating
    const getAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
        return total / ratings.length;
    };

    return (
        <div className="  px-4  ">
            {/* Search & Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                {/* Search Input */}
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Filter Select */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Select instrument" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Instruments</SelectItem>
                            {instrumentOptions.map((instrument, index) => (
                                <SelectItem key={index} value={instrument}>
                                    {instrument}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Course Grid */}
            {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No courses found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6    ">
                    {filteredCourses.map((course) => {
                        const avgRating = getAverageRating(course.ratings);

                        return (
                            <Card key={course._id} className="overflow-hidden  hover:shadow-lg transition-shadow    pt-0">
                                {/* Thumbnail */}
                                <div className=" ">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-60 object-cover"
                                    />
                                </div>

                                <CardHeader className=" ">
                                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                                    <CardDescription className="line-clamp-2 ">
                                        {course.longDescription || "No description available."}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className=" space-y-3  ">
                                    {/* Instructor */}
                                    {course.instructor?.name && (
                                        <p className="text-sm text-muted-foreground">
                                            Instructor:{" "}
                                            <span className="font-medium text-foreground">
                                                {course.instructor.name}
                                            </span>
                                        </p>
                                    )}

                                    {/* Rating */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={
                                                    i < Math.round(avgRating)
                                                        ? "text-yellow-500 fill-yellow-500"
                                                        : "text-muted fill-muted"
                                                }
                                            />
                                        ))}
                                        <span className="text-sm text-muted-foreground ml-1">
                                            ({avgRating.toFixed(1)})
                                        </span>
                                    </div>

                                    {/* Extra Info */}
                                    <div className="flex justify-between items-center">
                                        <Badge variant="secondary" className="text-xs">
                                            {course.instrument}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {course.level}
                                        </Badge>
                                    </div>

                                    {/* Price */}
                                    <p className="font-semibold text-primary text-lg">
                                        ${course.price}
                                    </p>
                                </CardContent>

                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href={`lessons/${course._id}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}