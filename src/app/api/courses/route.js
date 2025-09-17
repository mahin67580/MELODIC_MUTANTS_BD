import dbConnect, { collectionNamesObj } from "@/lib/dbconnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.instrument || !body.thumbnail || !body.videoPreview) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const lessonCollection = dbConnect(collectionNamesObj.lessonCollection);

    const newCourse = {
      title: body.title,
      instrument: body.instrument,
      level: body.level || "beginner",
      category: body.category || "general",
      description: body.description || "",
      longDescription: body.longDescription || "",
      price: body.price || 0,
      thumbnail: body.thumbnail,
      videoPreview: body.videoPreview,
      instructor: {
        name: body.instructor?.name || "Unknown",
        bio: body.instructor?.bio || "",
      },
      syllabus: body.syllabus || [],
      resources: body.resources || { downloadables: [] },
      scheduledSessions: body.scheduledSessions || [],
      // ✅ New fields
      enrolledStudents: body.enrolledStudents || 0, // default 0
      ratings: body.ratings || [], // [{ userId, rating, review, createdAt }]
      createdAt: new Date(),
    };

    const result = await lessonCollection.insertOne(newCourse);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error saving course:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save course" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const lessonCollection = dbConnect(collectionNamesObj.lessonCollection);
    const courses = await lessonCollection.find({}).toArray();

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
