import { NextResponse } from "next/server";
import { dbConnect, collectionNamesObj } from "@/lib/dbconnect";
import { ObjectId } from "mongodb";

// GET instructor by ID
export async function GET(request, { params }) {
  try {
    const { id } =await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid instructor ID" }, { status: 400 });
    }

    const instructorCollection = await dbConnect(collectionNamesObj.instructorCollection);
    const instructor = await instructorCollection.findOne({ _id: new ObjectId(id) });

    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }

    // Remove password from response
    const { password, ...instructorWithoutPassword } = instructor;
    
    return NextResponse.json(instructorWithoutPassword);
  } catch (error) {
    console.error("Error fetching instructor:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH update instructor
export async function PATCH(request, { params }) {
  try {
    const { id } =await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid instructor ID" }, { status: 400 });
    }

    const body = await request.json();
    const { bio, achievements, experienceYears, instrument } = body;

    // Validate required fields
    if (!bio || !experienceYears || !instrument) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const instructorCollection = await dbConnect(collectionNamesObj.instructorCollection);

    // Check if instructor exists
    const existingInstructor = await instructorCollection.findOne({ _id: new ObjectId(id) });
    if (!existingInstructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }

    // Update instructor
    const updateData = {
      bio,
      achievements,
      experienceYears: parseInt(experienceYears),
      instrument,
      updatedAt: new Date()
    };

    const result = await instructorCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made" }, { status: 400 });
    }

    return NextResponse.json({ 
      message: "Profile updated successfully",
      updated: true 
    });
  } catch (error) {
    console.error("Error updating instructor:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}