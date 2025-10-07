// app/api/admin/users/route.js
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
    const userCollection = await dbConnect(collectionNamesObj.userCollection);
    const users = await userCollection.find({}).toArray();
    
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}