import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please add your MongoDB URI to .env.local");

let client;
let clientPromise;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

if (process.env.NODE_ENV === "development") {
  // Use a global variable so it's cached across hot reloads in dev
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, just create once
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const collectionNamesObj = {
  lessonCollection: "test_data_lesson",
  userCollection: "users",
  instructorCollection: "instructors",
  bookingCollection: "bookings",
};

export async function dbConnect(collectionName) {
  const client = await clientPromise;
  return client.db(process.env.DB_NAME).collection(collectionName);
}
