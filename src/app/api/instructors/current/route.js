import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
 

export async function GET() {
  try {
    // Get session on server side
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Connect to instructors collection using your existing dbConnect function
    const instructorsCollection = await dbConnect(collectionNamesObj.instructorCollection);

    const instructor = await instructorsCollection.findOne(
      { email: session.user.email.toLowerCase() },
      { 
        projection: { 
          _id: 1, 
          name: 1, 
          email: 1, 
          instrument: 1, 
          bio: 1, 
          experienceYears: 1, 
          achievements: 1, 
          image: 1 
        } 
      }
    );

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    // Convert MongoDB ObjectId to string
    const instructorData = {
      ...instructor,
      _id: instructor._id.toString()
    };

    return NextResponse.json(instructorData);
  } catch (error) {
    console.error('Error fetching current instructor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}