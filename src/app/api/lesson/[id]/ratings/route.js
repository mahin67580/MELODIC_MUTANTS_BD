import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { user, rating, review } = body;

    if (!user || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const lessonCollection =await dbConnect(collectionNamesObj.lessonCollection);

    const result = await lessonCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          ratings: {
            user,
            rating: Number(rating),
            review: review || "",
            createdAt: new Date(),
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Rating added" });
  } catch (error) {
    console.error("Error saving rating:", error);
    return NextResponse.json(
      { error: "Failed to save rating" },
      { status: 500 }
    );
  }
}
