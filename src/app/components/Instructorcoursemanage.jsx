"use client";

import { useState } from "react";
import Link from "next/link";
// import Swal from "sweetalert2";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Users, DollarSign, Music } from "lucide-react";

export default function InstructorCourseManage({ courses }) {
  const [courseList, setCourseList] = useState(courses);
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [courseToDelete, setCourseToDelete] = useState(null);

  // Handle Delete Confirmation
  // const handleDeleteConfirm = async (id) => {
  //   try {
  //     const res = await fetch(`/api/courses/${id}`, {
  //       method: "DELETE",
  //     });

  //     if (res.ok) {
  //       setCourseList(courseList.filter((c) => c._id !== id));
  //       Swal.fire("Deleted!", "The course has been deleted.", "success");
  //     } else {
  //       Swal.fire("Error!", "Failed to delete the course.", "error");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire("Error!", "Something went wrong.", "error");
  //   } finally {
  //     setDeleteDialogOpen(false);
  //     setCourseToDelete(null);
  //   }
  // };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Get initials for avatar fallback
  const getInitials = (title) => {
    return title
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6  ">
     {/* Desktop Table View */}
<div className="hidden lg:block">
  <Card>
    <CardHeader>
      {/* <CardTitle>Manage Courses</CardTitle> */}
    </CardHeader>
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-[100px]">Thumbnail</TableHead>
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
              <TableCell>
                <div className="flex justify-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.thumbnail} alt={course.title} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 border-2 border-red-400">
                      {getInitials(course.title)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TableCell>
              <TableCell className="text-center font-medium">{course.title}</TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    <Music className="h-3 w-3" />
                    {course.instrument}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-center font-semibold">
                {formatPrice(course.price)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.enrolledStudents || 0}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/instructordashboard/managecourse/${course._id}`}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>

                  {/* <AlertDialog open={deleteDialogOpen && courseToDelete === course._id}
                    onOpenChange={(open) => {
                      setDeleteDialogOpen(open);
                      if (!open) setCourseToDelete(null);
                    }}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setCourseToDelete(course._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the course
                          "{course.title}" and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteConfirm(course._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Course
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {courseList.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Music className="h-12 w-12 text-gray-300" />
                  <p className="text-lg font-medium">No courses found</p>
                  <p className="text-sm">Create your first course to get started</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {courseList.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Music className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No courses found</p>
              <p className="text-sm text-muted-foreground">Create your first course to get started</p>
            </CardContent>
          </Card>
        ) : (
          courseList.map((course) => (
            <Card key={course._id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0">
                    <Avatar className="h-44 w-72 rounded-bl-2xl">
                      <AvatarImage src={course.thumbnail} alt={course.title} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(course.title)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 p-4 ">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg leading-tight   ">{course.title}</CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Music className="h-3 w-3" />
                        {course.instrument}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3 ">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-foreground">{formatPrice(course.price)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span className="font-semibold text-foreground">{course.enrolledStudents || 0} students</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="  w-full ">
                        <Link href={`/instructordashboard/managecourse/${course._id}`}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>

                      {/* <AlertDialog open={deleteDialogOpen && courseToDelete === course._id}
                        onOpenChange={(open) => {
                          setDeleteDialogOpen(open);
                          if (!open) setCourseToDelete(null);
                        }}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setCourseToDelete(course._id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{course.title}" and all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteConfirm(course._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}