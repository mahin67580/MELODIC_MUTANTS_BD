// // /app/api/instructor/check/route.js
// import { NextResponse } from "next/server";
// import { dbConnect, collectionNamesObj } from "@/lib/dbconnect";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";


// export async function GET() {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//         return NextResponse.json({ success: false, isInstructor: false });
//     }

//     const instructorCollection = await dbConnect(collectionNamesObj.instructorCollection);
//     const instructor = await instructorCollection.findOne({ email: session.user.email });

//     return NextResponse.json({
//         success: true,
//         isInstructor: !!instructor, // true if instructor exists
//     });
// }
