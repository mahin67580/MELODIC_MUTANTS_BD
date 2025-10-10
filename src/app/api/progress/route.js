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
      watchedVideos: progress?.watchedVideos || [],
      lastWatchedModule: progress?.lastWatchedModule || 0
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST to save/update progress
export async function POST(request) {
  try {
    // Check if request has body
    const contentLength = request.headers.get('content-length');
    if (!contentLength || parseInt(contentLength) === 0) {
      return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
    }

    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    let body;
    try {
      const text = await request.text();
      
      // Check if text is empty
      if (!text || text.trim() === '') {
        return NextResponse.json({ error: 'Empty JSON body' }, { status: 400 });
      }
      
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError.message 
      }, { status: 400 });
    }

    const { userId, courseId, watchedVideos, progress, lastWatchedModule } = body;

    // Validate required fields
    if (!userId || !courseId) {
      return NextResponse.json({ 
        error: 'User ID and Course ID are required',
        received: { userId, courseId }
      }, { status: 400 });
    }

    const progressCollection = await dbConnect(collectionNamesObj.progressBarCollection);
    
    // Validate and sanitize data
    const validatedProgress = Math.max(0, Math.min(100, Number(progress) || 0));
    const validatedWatchedVideos = Array.isArray(watchedVideos) 
      ? watchedVideos.map(vid => Number(vid)).filter(vid => !isNaN(vid))
      : [];
    const validatedLastWatchedModule = Number(lastWatchedModule) || 0;

    // console.log('Saving progress:', {
    //   userId,
    //   courseId,
    //   progress: validatedProgress,
    //   watchedVideos: validatedWatchedVideos,
    //   lastWatchedModule: validatedLastWatchedModule
    // });

    const result = await progressCollection.updateOne(
      { userId, courseId },
      { 
        $set: { 
          watchedVideos: validatedWatchedVideos,
          progress: validatedProgress,
          lastWatchedModule: validatedLastWatchedModule,
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
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId,
      data: {
        progress: validatedProgress,
        watchedVideos: validatedWatchedVideos,
        lastWatchedModule: validatedLastWatchedModule
      }
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}