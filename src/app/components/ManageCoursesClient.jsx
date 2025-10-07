"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ManageCoursesClient({ courses }) {
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
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Thumbnail</TableHead>
              <TableHead className="text-center">Title</TableHead>
              <TableHead className="text-center">Instrument</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Students</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseList.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="text-center">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-16 object-cover rounded mx-auto"
                  />
                </TableCell>
                <TableCell className="text-center font-medium">
                  {course.title}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{course.instrument}</Badge>
                </TableCell>
                <TableCell className="text-center font-semibold">
                  ${course.price}
                </TableCell>
                <TableCell className="text-center">
                  {course.enrolledStudents || 0}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Link
                      href={`/dashboard/admindashboard/managecourse/${course._id}`}
                    >
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {courseList.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan="6"
                  className="text-center py-6 text-gray-500"
                >
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {courseList.map((course) => (
          <Card key={course._id}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary">{course.instrument}</Badge>
                    <span className="text-sm text-gray-600">
                      ${course.price}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    {course.enrolledStudents || 0}
                  </span>{" "}
                  students
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/admindashboard/managecourse/${course._id}`}
                  >
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {courseList.length === 0 && (
          <Card>
            <CardContent className="py-6">
              <div className="text-center text-gray-500">
                No courses found.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}