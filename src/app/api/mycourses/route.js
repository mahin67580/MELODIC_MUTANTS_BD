import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";

export const GET = async (req) => {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const email = session.user.email
        const bookingCollection = await dbConnect(collectionNamesObj.bookingCollection)
        const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection)
        
        // Get user's bookings
        const bookings = await bookingCollection.find({ email }).toArray()
        
        if (bookings.length === 0) {
            return NextResponse.json([])
        }

        // Extract lesson IDs from bookings - use the "id" field
        const courseIds = bookings.map(booking => booking.id).filter(id => id !== undefined && id !== null)

        // If no valid course IDs found, return empty array
        if (courseIds.length === 0) {
            return NextResponse.json([])
        }

        // Convert string IDs to ObjectId
        const objectIds = courseIds.map(id => {
            try {
                return new ObjectId(id)
            } catch (error) {
                console.error('Invalid ObjectId:', id)
                return null
            }
        }).filter(id => id !== null)

        // Get course details for each booking
        const courses = await lessonCollection.find({ 
            _id: { $in: objectIds } 
        }).toArray()

        // Add progress information to each course
        // const coursesWithProgress = courses.map(course => ({
        //     ...course,
        //     progress: Math.floor(Math.random() * 100) // Random progress for demo
        // }))

        return NextResponse.json(courses)
    } catch (error) {
        console.error('Error fetching user courses:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}