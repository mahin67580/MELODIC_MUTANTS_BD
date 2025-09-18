 
 
import AllCoursesClient from "../components/AllCoursesClient";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";

export default async function AllCoursesPage() {
  const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);
  const data = await lessonCollection.find({}).toArray();

  // Convert MongoDB _id to string (for React keys)
  const courses = data.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
  }));

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8">🎸 All Courses</h1>
      <AllCoursesClient courses={courses} />
    </div>
  );
}
