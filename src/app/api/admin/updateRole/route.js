import { NextResponse } from "next/server";
import { dbConnect, collectionNamesObj } from "@/lib/dbconnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
 

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id, role } = await req.json();
    const userCollection = await dbConnect(collectionNamesObj.userCollection);

    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );

    return NextResponse.json({ success: true, role });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
