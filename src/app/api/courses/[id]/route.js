import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collectionNamesObj } from "@/lib/dbconnect";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const lessonCollection = dbConnect(collectionNamesObj.lessonCollection);

    const course = await lessonCollection.findOne({ _id: new ObjectId(id) });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

// ✅ New PATCH route to update enrolledStudents
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const lessonCollection = dbConnect(collectionNamesObj.lessonCollection);

    // increment enrolledStudents by 1
    const result = await lessonCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { enrolledStudents: 1 } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Enrollment updated" });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 });
  }
}
