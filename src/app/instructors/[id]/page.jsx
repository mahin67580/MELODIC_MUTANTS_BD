import { FaGuitar, FaAward, FaUserTie } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { dbConnect, collectionNamesObj } from "@/lib/dbconnect";
import { ObjectId } from "mongodb";
import Link from "next/link";

import Instructorcourse from "@/app/components/Instructorcourse";
export const dynamic = "force-dynamic"; // always fresh
// or: export const revalidate = 60;

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
                <h1 className="text-2xl font-bold">Instructor not found</h1>
                <Link href="/instructors" className="text-green-600 hover:underline">
                    ← Back to Instructors
                </Link>
            </div>
        );
    }

    // ✅ Connect to DB and fetch courses belonging to this user
    const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);
    const data = await lessonCollection
        .find({ email: instructor.email }) // filter by email
        .toArray();

    const courses = data.map((doc) => ({
        ...doc,
        _id: doc._id.toString(), // convert for React keys
    }));

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            {/* Back button */}
            <Link
                href="/instructors"
                className="inline-block mb-6 text-green-600 hover:underline"
            >
                ← Back to Instructors
            </Link>

            {/* Profile Card */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                {/* Image */}
                <img
                    src={instructor.image || "/default-avatar.png"}
                    alt={instructor.name}
                    className="w-full h-64 object-cover"
                />

                <div className="p-6 space-y-4">
                    {/* Name */}
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FaUserTie className="text-green-600" /> {instructor.name}
                    </h1>

                    {/* Email */}
                    <p className="text-gray-600 flex items-center gap-2">
                        <MdOutlineEmail className="text-gray-500" /> {instructor.email}
                    </p>

                    {/* Bio */}
                    <p className="text-gray-700 leading-relaxed">{instructor.bio}</p>

                    {/* Instrument + Experience */}
                    <div className="flex items-center gap-6 text-gray-700 text-sm">
                        <span className="flex items-center gap-1">
                            <FaGuitar className="text-green-600" /> {instructor.instrument}
                        </span>
                        <span className="flex items-center gap-1">
                            🎵 {instructor.experienceYears} yrs experience
                        </span>
                    </div>

                    {/* Achievements */}
                    {instructor.achievements && (
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                            <FaAward className="text-yellow-500 mt-1" />
                            <p>{instructor.achievements}</p>
                        </div>
                    )}

                    {/* Registered At */}
                    <p className="text-xs text-gray-500">
                        Joined on{" "}
                        {new Date(instructor.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>


            <div className="min-h-screen p-6 md:p-12 bg-gray-50">
                <h1 className="text-3xl font-bold mb-6 text-center">📚 Courses By {instructor.name} </h1>

                {courses.length > 0 ? (
                    <Instructorcourse courses={courses} />
                ) : (
                    <p className="text-center text-gray-500">No courses found for your account.</p>
                )}
            </div>
        </div>
    );
}
