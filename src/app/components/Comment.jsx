 
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect'
import CommentSlider from './CommentSlider'

export default async function Comment() {
  const lessonCollection = await dbConnect(collectionNamesObj.lessonCollection)
  const data = await lessonCollection.find({}).toArray()

  const allRatings = data.flatMap(lesson => 
    (lesson.ratings || []).map(rating => ({
      ...rating,
      lessonTitle: lesson.title,
      lessonThumbnail: lesson.thumbnail
    }))
  )

  if (allRatings.length === 0) {
    return (
      <div className="w-full py-12 bg-gray-50 flex justify-center items-center">
        <p className="text-gray-500">No reviews yet.</p>
      </div>
    )
  }

  return <CommentSlider ratings={allRatings} />
}
