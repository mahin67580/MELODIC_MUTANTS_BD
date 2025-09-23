"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
export default function instructorcoursemanage({ courses }) {
    const [courseList, setCourseList] = useState(courses);

    // Handle Delete
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/courses/${id}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    setCourseList(courseList.filter((c) => c._id !== id));
                    Swal.fire("Deleted!", "The course has been deleted.", "success");
                } else {
                    Swal.fire("Error!", "Failed to delete the course.", "error");
                }
            } catch (error) {
                console.error(error);
                Swal.fire("Error!", "Something went wrong.", "error");
            }
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="table w-full border">
                <thead className="bg-gray-100">
                    <tr>
                        <th>Thumbnail</th>
                        <th>Title</th>
                        <th>Instrument</th>
                        <th>Price</th>
                        <th>Students</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courseList.map((course) => (
                        <tr key={course._id} className="border-b">
                            <td>
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            </td>
                            <td className="font-medium">{course.title}</td>
                            <td>{course.instrument}</td>
                            <td>${course.price}</td>
                            <td>{course.enrolledStudents || 0}</td>
                            <td className="space-x-2">


                                <Link href={`/lessons/${course._id}`}>
                                    <button className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                                        View Details
                                    </button>
                                </Link>

                            </td>
                        </tr>
                    ))}
                    {courseList.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-6 text-gray-500">
                                No courses found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
