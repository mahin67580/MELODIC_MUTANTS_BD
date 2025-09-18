import { authOptions } from "@/lib/authOptions";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
 
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export const GET = async (req) => {
    const session = await getServerSession(authOptions);

    if (session) {
        const email = session?.user?.email;
        const { searchParams } = new URL(req.url);
        const lessonId = searchParams.get("lessonId");

        const bookingCollection =await dbConnect(collectionNamesObj.bookingCollection);

        let query = { email };
        if (lessonId) {
            query = { email, id: lessonId }; // ✅ check by lesson id too
        }

        const result = await bookingCollection.find(query).toArray();
        return NextResponse.json(result);
    }

    return NextResponse.json([]);
};


export const POST = async (req) => {
    const body = await req.json();
    const bookingCollection = await dbConnect(collectionNamesObj.bookingCollection);

    // Prevent duplicate booking
    const exists = await bookingCollection.findOne({
        email: body.email,
        id: body.id, // lesson id
    });

    if (exists) {
        return NextResponse.json(
            { error: "Already enrolled in this lesson" },
            { status: 400 }
        );
    }

    const result = await bookingCollection.insertOne(body);
    return NextResponse.json(result);
};
