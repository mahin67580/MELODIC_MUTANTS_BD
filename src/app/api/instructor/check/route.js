import { authOptions } from "@/lib/authOptions";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
 
 

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json({ isInstructor: false });
  }

  const instructorCollection = await dbConnect(collectionNamesObj.instructorCollection);
  const instructor = await instructorCollection.findOne({ email: session.user.email });

  return Response.json({ isInstructor: !!instructor });
}