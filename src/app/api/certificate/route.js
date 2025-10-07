import { NextResponse } from 'next/server';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';

// Verify course completion and generate certificate data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    console.log('Certificate request received:', { userId, courseId });

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID are required' }, { status: 400 });
    }

    // Connect to database
    const progressCollection = await dbConnect(collectionNamesObj.progressBarCollection);
    const coursesCollection = await dbConnect(collectionNamesObj.lessonCollection);

    // Verify course completion
    const progress = await progressCollection.findOne({ 
      userId: userId.toString(), 
      courseId: courseId.toString() 
    });

    console.log('Progress found in database:', progress);
    
    // Check if progress exists and is exactly 100
    if (!progress) {
      return NextResponse.json({ 
        error: 'No progress record found for this course',
        currentProgress: 0
      }, { status: 400 });
    }

    if (progress.progress < 100) {
      return NextResponse.json({ 
        error: 'Course not completed',
        currentProgress: progress.progress,
        requiredProgress: 100
      }, { status: 400 });
    }

    // Get course details
    let course;
    try {
      course = await coursesCollection.findOne({ 
        _id: new ObjectId(courseId.toString()) 
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Generate certificate data
    const certificateData = {
      certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      issueDate: new Date().toISOString().split('T')[0],
      studentName: userId,
      courseTitle: course.title,
      instructor: course.instructor?.name || 'Unknown Instructor',
      duration: 'Self-paced',
      skills: course.syllabus || [],
      thumbnail: course.thumbnail,
      completionDate: new Date().toISOString(),
      level: course.level || 'All Levels',
      category: course.category || 'General',
      totalModules: course.milestones?.flatMap(m => m.modules).length || 0,
      completedModules: progress.watchedVideos?.length || 0
    };

    console.log('Certificate data generated successfully:', {
      certificateId: certificateData.certificateId,
      progress: progress.progress,
      totalModules: certificateData.totalModules,
      completedModules: certificateData.completedModules
    });

    return NextResponse.json(certificateData);
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}