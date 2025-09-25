"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { 
//   AlertDialog, 
//   AlertDialogAction, 
//   AlertDialogCancel, 
//   AlertDialogContent, 
//   AlertDialogDescription, 
//   AlertDialogFooter, 
//   AlertDialogHeader, 
//   AlertDialogTitle, 
//   AlertDialogTrigger 
// } from "@/components/ui/alert-dialog";
// import { 
//   DropdownMenu, 
//   DropdownMenuContent, 
//   DropdownMenuItem, 
//   DropdownMenuTrigger 
// } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MoreVertical, FileText, Users, DollarSign, Guitar } from "lucide-react";

export default function InstructorCourseManage({ courses }) {
    const [courseList, setCourseList] = useState(courses);

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/courses/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setCourseList(courseList.filter((c) => c._id !== id));
            } else {
                console.error("Failed to delete the course");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    // Get initials for avatar fallback
    const getInitials = (title) => {
        return title.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="hidden lg:block">


                <Table className={'border-2'}>
                    <TableHeader>
                        <TableRow >
                            <TableHead className="text-center">Course</TableHead>
                            <TableHead className="text-center">Instrument</TableHead>
                            <TableHead className="text-center">Price</TableHead>
                            <TableHead className="text-center">Students</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courseList.map((course) => (
                            <TableRow key={course._id}>
                                <TableCell>
                                    <div className="  ">
                                        {/* <Avatar className="h-30 w-30">
                                            <AvatarImage src={course.thumbnail} alt={course.title} />
                                            <AvatarFallback>
                                                {getInitials(course.title)}
                                            </AvatarFallback>
                                        </Avatar> */}
                                        <div className="text-center">
                                            <div className="font-medium">{course.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                {course.description?.substring(0, 50)}...
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                            <Guitar className="h-3 w-3" />
                                            {course.instrument}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold text-center">
                                    ${course.price}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-1">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        {course.enrolledStudents || 0}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-2">
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/lessons/${course._id}`}>
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className={'flex items-center  justify-center'}>

                                    <Avatar className="h-20 w-20">
                                        <AvatarImage className={'object-cover'} src={course.thumbnail} alt={course.title} />
                                        <AvatarFallback>
                                            {getInitials(course.title)}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>

                            </TableRow>
                        ))}
                        {courseList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <div className="text-muted-foreground">
                                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p>No courses found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>


            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">


                {courseList.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                                <p className="text-muted-foreground">No courses found</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Create your first course to get started
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {courseList.map((course) => (
                            <Card key={course._id} className="overflow-hidden">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage className={'object-cover'} src={course.thumbnail} alt={course.title} />
                                                <AvatarFallback className="text-sm">
                                                    {getInitials(course.title)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-lg leading-tight">
                                                    {course.title}
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {course.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Guitar className="h-3 w-3" />
                                            {course.instrument}
                                        </Badge>

                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4" />
                                                <span className="font-semibold">${course.price}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{course.enrolledStudents || 0} students</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button asChild className="w-full mt-7" size="sm">
                                        <Link href={`/lessons/${course._id}`}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Course Details
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}