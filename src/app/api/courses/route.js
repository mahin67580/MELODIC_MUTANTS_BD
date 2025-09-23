import { authOptions } from "@/lib/authOptions";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.instrument || !body.thumbnail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate milestones structure
    if (body.milestones && !Array.isArray(body.milestones)) {
      return NextResponse.json(
        { success: false, error: "Milestones must be an array" },
        { status: 400 }
      );
    }
    // Optionally, validate each milestone object
    if (Array.isArray(body.milestones)) {
      for (const milestone of body.milestones) {
        if (
          typeof milestone.title !== "string" ||
          !Array.isArray(milestone.modules)
        ) {
          return NextResponse.json(
            { success: false, error: "Invalid milestone structure" },
            { status: 400 }
          );
        }
        // Optional: validate each module
        for (const mod of milestone.modules) {
          if (typeof mod.title !== "string" || typeof mod.video !== "string") {
            return NextResponse.json(
              { success: false, error: "Invalid module structure in milestones" },
              { status: 400 }
            );
          }
        }
      }
    }

    const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);

    const newCourse = {
      email: session?.user?.email || "unknown",
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
      milestones: Array.isArray(body.milestones) ? body.milestones : [],
      enrolledStudents: body.enrolledStudents || 0,
      ratings: body.ratings || [],
      createdAt: new Date(),
    };

    const result = await lessonCollection.insertOne(newCourse);

    // Return the inserted course document
    const insertedCourse = await lessonCollection.findOne({ _id: result.insertedId });

    return NextResponse.json({ success: true, data: insertedCourse });
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
    const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);
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
