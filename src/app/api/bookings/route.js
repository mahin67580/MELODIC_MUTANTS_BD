// app/api/bookings/route.js
import { NextResponse } from "next/server";
import { dbConnect, collectionNamesObj } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const bookingCollection = await dbConnect(collectionNamesObj.bookingCollection);
    const bookings = await bookingCollection.find({}).toArray();
    
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}