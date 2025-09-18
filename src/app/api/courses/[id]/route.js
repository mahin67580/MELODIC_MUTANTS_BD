import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";

// ✅ GET /api/courses/:id → get single course
export async function GET(req, { params }) {
  try {
    const { id } =await params;
    const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);

    const course = await lessonCollection.findOne({ _id: new ObjectId(id) });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

// ✅ PATCH /api/courses/:id → update course
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);

    let updateQuery = {};

    // 🔹 Case 1: If body.enroll = true → increment enrolledStudents
    if (body?.enroll) {
      updateQuery = { $inc: { enrolledStudents: 1 } };
    }
    // 🔹 Case 2: General updates (title, price, etc.)
    else {
      updateQuery = { $set: body };
    }

    const result = await lessonCollection.updateOne(
      { _id: new ObjectId(id) },
      updateQuery
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Course updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

// ✅ DELETE /api/courses/:id → delete course
export async function DELETE(req, { params }) {
  try {
    const { id } =await params;
    const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);

    const result = await lessonCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Course deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
