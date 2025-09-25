import { FaGuitar, FaAward, FaUserTie } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { dbConnect, collectionNamesObj } from "@/lib/dbconnect";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Instructorcourse from "@/app/components/Instructorcourse";

export const dynamic = "force-dynamic";

export default async function InstructorDetailPage({ params }) {
    const { id } = await params;

    const instructorCollection = await dbConnect(
        collectionNamesObj.instructorCollection
    );

    // fetch instructor by ID
    const instructor = await instructorCollection.findOne({
        _id: new ObjectId(id),
    });

    if (!instructor) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10 text-center">
                <Card>
                    <CardContent className="pt-6">
                        <h1 className="text-2xl font-bold mb-4">Instructor not found</h1>
                        <Button asChild variant="outline">
                            <Link href="/instructors">
                                ← Back to Instructors
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Fetch courses belonging to this instructor
    const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);
    const data = await lessonCollection
        .find({ email: instructor.email })
        .toArray();

    const courses = data.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
    }));

    // Get initials for avatar fallback
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="  px-4 py-8 space-y-8">
            {/* Back Navigation */}
            <section>
                <Button asChild variant="ghost" className="pl-0">
                    <Link href="/instructors">
                        ← Back to Instructors
                    </Link>
                </Button>
            </section>

            {/* Profile Header Section */}
            <section>
                <Card className="overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                <AvatarImage className={'object-cover'}
                                    src={instructor.image || ""}
                                    alt={instructor.name}
                                />
                                <AvatarFallback className="text-3xl font-bold">
                                    {getInitials(instructor.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="text-center md:text-left space-y-2">
                                <h1 className="text-3xl font-bold">{instructor.name}</h1>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                                    <MdOutlineEmail className="w-4 h-4" />
                                    <span>{instructor.email}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <FaGuitar className="w-3 h-3" />
                                        {instructor.instrument}
                                    </Badge>
                                    <Badge variant="outline">
                                        🎵 {instructor.experienceYears} years experience
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            <div className="grid gap-8 lg:grid-cols-3  ">
                {/* Left Column - Bio and Details */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Bio Section */}
                    <section>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FaUserTie className="text-primary" />
                                    About Me
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {instructor.bio}
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Achievements Section */}
                    {instructor.achievements && (
                        <section>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FaAward className="text-amber-500" />
                                        Achievements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        {instructor.achievements}
                                    </p>
                                </CardContent>
                            </Card>
                        </section>
                    )}
                </div>

                {/* Right Column - Sidebar Info */}

            </div>

            <div>
                <div className="  grid lg:grid-cols-3  gap-3    ">
                    {/* Experience Card */}
                    <section  >
                        <Card className={"h-44 "}>
                            <CardHeader>
                                <CardTitle className="text-lg">Teaching Experience</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center space-y-2">
                                    <div className="text-4xl font-bold text-primary">
                                        {instructor.experienceYears}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Years of Experience
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Join Date Card */}
                    <section>
                        <Card className={"h-44 "}>
                            <CardHeader>
                                <CardTitle className="text-lg">Member Since</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="text-lg font-semibold">
                                        {new Date(instructor.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                        })}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(instructor.createdAt).toLocaleDateString("en-US", {
                                            day: "numeric",
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Instrument Card */}
                    <section>
                        <Card className={"h-44 "}>
                            <CardHeader>
                                <CardTitle className="text-lg">Specialization</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center gap-2">
                                    <FaGuitar className="text-primary w-5 h-5" />
                                    <span className="font-medium">{instructor.instrument}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>

            {/* Courses Section */}
            <section>
                <Separator className="my-8" />

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        📚 Courses by {instructor.name}
                    </h2>
                    <p className="text-muted-foreground">
                        Explore all courses taught by this instructor
                    </p>
                </div>

                {courses.length > 0 ? (
                    <Instructorcourse courses={courses} />
                ) : (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">📚</div>
                                <h3 className="text-xl font-semibold mb-2">No Courses Available</h3>
                                <p className="text-muted-foreground">
                                    This instructor hasn't published any courses yet.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </section>
        </div>
    );
}