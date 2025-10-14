import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();
    const { lessonId, paymentIntentId, amount } = body;

    const bookingCollection = await dbConnect(collectionNamesObj.bookingCollection);
    const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);

    // Check if already enrolled
    const exists = await bookingCollection.findOne({
      email: session.user.email,
      id: lessonId,
    });

    if (exists) {
      return NextResponse.json(
        { error: 'Already enrolled in this lesson' },
        { status: 400 }
      );
    }

    // Create enrollment record
    const enrollmentData = {
      email: session.user.email,
      name: session.user.name,
      lessonId: lessonId,
      lessonTitle: body.lessonTitle,
      price: amount,
      paymentMethod: 'stripe',
      paymentIntentId: paymentIntentId,
      enrolledAt: new Date(),
      status: 'active',
    };

    const enrollmentResult = await bookingCollection.insertOne(enrollmentData);

    // Increment enrolledStudents count
    await lessonCollection.updateOne(
      { _id: lessonId },
      { $inc: { enrolledStudents: 1 } }
    );

    return NextResponse.json({
      success: true,
      enrollmentId: enrollmentResult.insertedId,
    });
  } catch (error) {
    console.error('Error processing payment success:', error);
    return NextResponse.json(
      { error: 'Failed to process enrollment' },
      { status: 500 }
    );
  }
}