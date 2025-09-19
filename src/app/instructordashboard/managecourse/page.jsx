import ManageCoursesClient from "@/app/components/ManageCoursesClient";
import Instructorcoursemanage from "@/app/components/Instructorcoursemanage";

import { authOptions } from "@/lib/authOptions";


import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";

export default async function ManageCoursesPage() {
  // ✅ Get logged-in user session
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">⚠️ Please log in to view your courses.</p>
      </div>
    );
  }

  // ✅ Connect to DB and fetch courses belonging to this user
  const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);
  const data = await lessonCollection
    .find({ email: session.user.email }) // filter by email
    .toArray();

  const courses = data.map((doc) => ({
    ...doc,
    _id: doc._id.toString(), // convert for React keys
  }));

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Manage Your Courses</h1>

      {courses.length > 0 ? (
        <Instructorcoursemanage courses={courses} />
      ) : (
        <p className="text-center text-gray-500">No courses found for your account.</p>
      )}
    </div>
  );
}
