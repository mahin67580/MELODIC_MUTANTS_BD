 
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { NextResponse } from 'next/server';
 

// GET progress for a user and course
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID are required' }, { status: 400 });
    }

    const progressCollection = await dbConnect(collectionNamesObj.progressBarCollection);
    
    const progress = await progressCollection.findOne({
      userId,
      courseId
    });

    return NextResponse.json({ 
      progress: progress?.progress || 0, 
      watchedVideos: progress?.watchedVideos || [] 
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST to save/update progress
export async function POST(request) {
  try {
    const { userId, courseId, watchedVideos, progress, lastWatchedModule } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID are required' }, { status: 400 });
    }

    const progressCollection = await dbConnect(collectionNamesObj.progressBarCollection);
    
    const result = await progressCollection.updateOne(
      { userId, courseId },
      { 
        $set: { 
          watchedVideos,
          progress,
          lastWatchedModule,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Progress saved successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}