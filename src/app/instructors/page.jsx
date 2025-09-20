 
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import InstructorsPage from "./InstructorsPage";

export const dynamic = "force-dynamic"; // always fresh
// or: export const revalidate = 60; // cache for 60s

export default async function Page() {
  const instructorCollection = await dbConnect(
    collectionNamesObj.instructorCollection
  );
  const instructors = await instructorCollection.find().toArray();

  // Serialize _id
  const serialized = instructors.map((i) => ({
    ...i,
    _id: i._id.toString(),
  }));

  return <InstructorsPage instructors={serialized} />;
}
