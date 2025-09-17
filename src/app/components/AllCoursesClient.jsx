"use client";
import React, { useState } from "react";
import { Search, Filter, Star } from "lucide-react";
import Link from "next/link";

export default function AllCoursesClient({ courses }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

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
        <div>
            {/* Search & Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                {/* Search Input */}
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Filter Dropdown */}
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-500" size={18} />
                    <select
                        className="border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Instruments</option>
                        <option value="Electric Guitar">Electric Guitar</option>
                        <option value="Acoustic Guitar">Acoustic Guitar</option>
                        <option value="Piano">Piano</option>
                        <option value="Violin">Violin</option>
                    </select>
                </div>
            </div>

            {/* Course Grid */}
            {filteredCourses.length === 0 ? (
                <p className="text-center text-gray-600">No courses found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => {
                        const avgRating = getAverageRating(course.ratings);

                        return (
                            <div
                                key={course._id}
                                className="rounded-2xl shadow-md hover:shadow-xl transition bg-white"
                            >
                                {/* Thumbnail */}
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-48 object-cover rounded-t-2xl"
                                />

                                {/* Card Body */}
                                <div className="p-4 flex flex-col gap-2">
                                    <h2 className="font-bold text-lg">{course.title}</h2>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {course.description || "No description available."}
                                    </p>

                                    {/* Instructor */}
                                    {course.instructor?.name && (
                                        <p className="text-sm text-gray-500">
                                            Instructor:{" "}
                                            <span className="font-medium">
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
                                                        : "text-gray-300"
                                                }
                                            />
                                        ))}
                                        <span className="text-sm text-gray-600 ml-1">
                                            ({avgRating.toFixed(0)})
                                        </span>
                                    </div>

                                    {/* Extra Info */}
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>{course.instrument}</span>
                                        <span>{course.level}</span>
                                    </div>

                                    <p className="font-semibold text-indigo-600">
                                        ${course.price}
                                    </p>

                                    {/* Button */}
                                    <Link href={`lessons/${course._id}`}>
                                        <button className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                                            View Details
                                        </button>
                                    </Link>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
