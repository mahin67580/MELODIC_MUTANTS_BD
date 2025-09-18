// app/dashboard/admindashboard/managecours/page.jsx
import ManageCoursesClient from "@/app/components/ManageCoursesClient";
import { dbConnect, collectionNamesObj } from "@/lib/dbconnect";
 

export default async function ManageCoursesPage() {
    const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);
    const data = await lessonCollection.find({}).toArray();

    const courses = data.map((doc) => ({
        ...doc,
        _id: doc._id.toString(), // convert for React keys
    }));

    return (
        <div className="min-h-screen p-6 md:p-12 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-center">📚 Manage Courses</h1>
            <ManageCoursesClient courses={courses} />
        </div>
    );
}
