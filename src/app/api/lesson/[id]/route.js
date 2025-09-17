import { authOptions } from '@/lib/authOptions'
import dbConnect, { collectionNamesObj } from '@/lib/dbconnect'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache' // Add this import

export const DELETE = async (req, { params }) => {
    const bookingCollection = dbConnect(collectionNamesObj.bookingCollection)
    const { id } = await params; // Destructure properly
    const query = { _id: new ObjectId(id) }

    // Validation
    const session = await getServerSession(authOptions)
    const currentBooking = await bookingCollection.findOne(query)

    const isOwnerOK = session?.user?.email == currentBooking.email

    if (isOwnerOK) {
        // Deleting User specific booking
        const deleteResponse = await bookingCollection.deleteOne(query)
        revalidatePath("/my-bookings") // This should work now
        return NextResponse.json(deleteResponse)
    }
    else {
        return NextResponse.json({ success: false, message: "Forbidden Action" }, { status: 401 })
    }
}

export const GET = async (req, { params }) => {
    const { id } = await params
    const lessonCollection = dbConnect(collectionNamesObj.lessonCollection)
    const data = await lessonCollection.findOne({ _id: new ObjectId(id) })

    return NextResponse.json(data);
}