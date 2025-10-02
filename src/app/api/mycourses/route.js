// import { authOptions } from "@/lib/authOptions";
// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server"
// import { ObjectId } from "mongodb"
// import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";

// export const GET = async (req) => {
//     try {
//         const session = await getServerSession(authOptions)
        
//         if (!session) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//         }

//         const email = session.user.email
//         const bookingCollection = await dbConnect(collectionNamesObj.bookingCollection)
//         const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection)
        
//         // Get user's bookings
//         const bookings = await bookingCollection.find({ email }).toArray()
        
//         if (bookings.length === 0) {
//             return NextResponse.json([])
//         }

//         // Extract lesson IDs from bookings - use the "id" field
//         const courseIds = bookings.map(booking => booking.id).filter(id => id !== undefined && id !== null)

//         // If no valid course IDs found, return empty array
//         if (courseIds.length === 0) {
//             return NextResponse.json([])
//         }

//         // Convert string IDs to ObjectId
//         const objectIds = courseIds.map(id => {
//             try {
//                 return new ObjectId(id)
//             } catch (error) {
//                 console.error('Invalid ObjectId:', id)
//                 return null
//             }
//         }).filter(id => id !== null)

//         // Get course details for each booking
//         const courses = await lessonCollection.find({ 
//             _id: { $in: objectIds } 
//         }).toArray()

//         // Add progress information to each course
//         // const coursesWithProgress = courses.map(course => ({
//         //     ...course,
//         //     progress: Math.floor(Math.random() * 100) // Random progress for demo
//         // }))

//         return NextResponse.json(courses)
//     } catch (error) {
//         console.error('Error fetching user courses:', error)
//         return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//     }
// }


import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";

// Helper function to convert MongoDB documents to plain objects
function convertToPlainObject(doc) {
    if (!doc) return null;
    
    return JSON.parse(JSON.stringify(doc, (key, value) => {
        // Convert ObjectId to string
        if (value && value._id && value._id.toString) {
            return { ...value, _id: value._id.toString() };
        }
        // Convert other ObjectId instances
        if (value && value.constructor && value.constructor.name === 'ObjectId') {
            return value.toString();
        }
        // Convert Date objects to ISO string
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    }));
}

// Helper function to calculate total modules in a course
function calculateTotalModules(course) {
    if (!course.milestones) return 0;
    return course.milestones.reduce((total, milestone) => {
        return total + (milestone.modules?.length || 0);
    }, 0);
}

export const GET = async (req) => {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const email = session.user.email;
        const bookingCollection = await dbConnect(collectionNamesObj.bookingCollection);
        const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection);
        const progressCollection = await dbConnect(collectionNamesObj.progressBarCollection);
        
        // Get user's bookings
        const bookings = await bookingCollection.find({ email }).toArray();
        
        if (bookings.length === 0) {
            return NextResponse.json([]);
        }

        // Extract lesson IDs from bookings - use the "id" field
        const courseIds = bookings.map(booking => booking.id).filter(id => id !== undefined && id !== null);

        // If no valid course IDs found, return empty array
        if (courseIds.length === 0) {
            return NextResponse.json([]);
        }

        // Convert string IDs to ObjectId for querying lessons
        const objectIds = courseIds.map(id => {
            try {
                return new ObjectId(id);
            } catch (error) {
                console.error('Invalid ObjectId:', id);
                return null;
            }
        }).filter(id => id !== null);

        // Get course details for each booking
        const courses = await lessonCollection.find({ 
            _id: { $in: objectIds } 
        }).toArray();

        // Get progress data for all courses in a single query
        const progressData = await progressCollection.find({
            userId: email,
            courseId: { $in: courseIds }
        }).toArray();

        // Create a map for quick progress lookup
        const progressMap = new Map();
        progressData.forEach(progress => {
            progressMap.set(progress.courseId, progress);
        });

        // Combine course data with progress information
        const coursesWithProgress = await Promise.all(
            courses.map(async (course) => {
                const courseId = course._id.toString();
                const progress = progressMap.get(courseId);
                const totalModules = calculateTotalModules(course);
                
                // Calculate completion percentage based on watched videos
                let progressPercentage = 0;
                let completedModules = 0;
                
                if (progress && progress.watchedVideos) {
                    completedModules = progress.watchedVideos.length;
                    if (totalModules > 0) {
                        progressPercentage = Math.round((completedModules / totalModules) * 100);
                    }
                } else if (progress && progress.progress) {
                    // Fallback to stored progress percentage
                    progressPercentage = progress.progress;
                    completedModules = Math.round((progressPercentage / 100) * totalModules);
                }

                // Convert course to plain object
                const plainCourse = convertToPlainObject(course);
                
                return {
                    ...plainCourse,
                    progress: progressPercentage,
                    completedModules: completedModules,
                    totalModules: totalModules,
                    lastWatched: progress?.updatedAt || progress?.createdAt || null,
                    userProgress: progress ? convertToPlainObject(progress) : null
                };
            })
        );

        return NextResponse.json(coursesWithProgress);
    } catch (error) {
        console.error('Error fetching user courses:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}