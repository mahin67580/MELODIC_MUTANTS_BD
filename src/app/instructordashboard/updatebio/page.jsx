"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaGuitar, FaAward, FaUserTie, FaEdit, FaMusic, FaCalendarAlt, FaBook, FaChalkboardTeacher } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function InstructorDashboardPage() {
  const router = useRouter();
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchCurrentInstructor = async () => {
      try {
        setLoading(true);
        setError("");

        const instructorId = await getCurrentInstructorId();

        if (!instructorId) {
          throw new Error("No instructor ID found");
        }

        const response = await fetch(`/api/instructors/${instructorId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch instructor data");
        }

        const data = await response.json();
        setInstructor(data);
      } catch (error) {
        console.error("Error fetching instructor:", error);
        setError("Failed to load your profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentInstructor();
  }, []);

  // This function should be implemented based on your auth system
  const getCurrentInstructorId = async () => {
    try {
      const response = await fetch('/api/instructors/current');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch current instructor");
      }

      const instructorData = await response.json();

      if (!instructorData?._id) {
        throw new Error("Instructor not found");
      }

      return instructorData._id;
    } catch (error) {
      console.error("Error getting current instructor ID:", error);
      // Fallback to hardcoded ID for demo purposes

    }
  };

  const handleEditBio = () => {
    if (instructor?._id) {
      router.push(`/instructordashboard/updatebio/${instructor._id}`);
    }
  };

  const handleManageCourses = () => {
    router.push('/instructordashboard/manage-courses');
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || "IN";
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <Separator />

        {/* Stats Skeleton */}
        <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="  py-8 space-y-6">
      {/* Header - Redesigned to match the image */}




      {/* Profile Card - Redesigned to match the image layout */}
      <div className="grid gap-6 grid-cols-1  ">
        {/* Left Column - Profile Info */}
        <Card className=" ">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Avatar className="lg:h-72 lg:w-96 h-44 w-60 ">
                <AvatarImage className={'object-cover'} src={instructor?.image} alt={instructor?.name} />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {getInitials(instructor?.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{instructor?.name || "Instructor Name"}</CardTitle>
            <CardDescription className="text-base">{instructor?.instrument || "Music Instructor"}</CardDescription>
            <Badge variant="secondary" className="mt-2">Music Instructor</Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Member since</span>
              <span className="text-sm font-medium">
                {instructor?.createdAt ? new Date(instructor.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last active</span>
              <span className="text-sm font-medium">2 hours ago</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Role</span>
              <span className="text-sm font-medium">{instructor?.role}</span>
            </div>


            <Separator />

            <div className="space-y-2">
              <Button className="w-full" onClick={handleEditBio}>
                <FaEdit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>

            </div>
          </CardContent>
        </Card>

        {/* Right Column - Stats and Content */}
        <div className="  space-y-6">
          {/* Stats Cards - Redesigned to match the image */}
          <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <FaMusic className="text-primary" />
                  Instrument
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold truncate">{instructor?.instrument || "Not set"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <FaCalendarAlt className="text-primary" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">
                  {instructor?.experienceYears || "0"} <span className="text-sm font-normal">years</span>
                </p>
              </CardContent>
            </Card>


          </div>



          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaUserTie className="text-primary" />
                Your Bio
              </CardTitle>
              <CardDescription>
                This is how students see your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {instructor?.bio ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {instructor.bio}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <FaUserTie className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No bio added yet</p>
                  <p>Add a bio to introduce yourself to potential students.</p>
                </div>
              )}

              <Button
                onClick={handleEditBio}
                variant={instructor?.bio ? "outline" : "default"}
                className="w-full"
              >
                <FaEdit className="w-4 h-4 mr-2" />
                {instructor?.bio ? "Edit Bio" : "Add Bio"}
              </Button>
            </CardContent>
          </Card>

          {/* Achievements Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaAward className="text-amber-500" />
                Achievements
              </CardTitle>
              <CardDescription>
                Your musical achievements and awards
              </CardDescription>
            </CardHeader>
            <CardContent>
              {instructor.achievements && (
                <section>


                  <CardContent className="flex justify-center lg:justify-start   flex-wrap gap-4">
                    {instructor.achievements
                      .split(",")
                      .map((achievement, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-2xl shadow bg-white border text-center 
                                                                 transition transform hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r from-primary/10 to-primary/5"
                        >
                          <p className="text-sm text-gray-700">{achievement.trim()}</p>
                        </div>
                      ))}
                  </CardContent>

                </section>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {(!instructor?.bio || !instructor?.instrument || !instructor?.experienceYears) && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertDescription className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="font-medium">Complete your profile!</span>
              <span className="ml-2 text-amber-700">
                Add your bio, instrument, and experience to attract more students.
              </span>
            </div>
            <Button onClick={handleEditBio} size="sm" className="mt-2 md:mt-0">
              Complete Now
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}