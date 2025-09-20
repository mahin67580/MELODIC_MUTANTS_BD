 
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const instructorCollection = await dbConnect(collectionNamesObj.instructorCollection);
    const instructors = await instructorCollection.find().toArray();

    return NextResponse.json({ success: true, instructors });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to fetch instructors" }, { status: 500 });
  }
}
