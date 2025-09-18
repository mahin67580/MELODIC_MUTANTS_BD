"use server"


import { authOptions } from "@/lib/authOptions";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

export default async function RegisterInstructor(payload) {

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }


  const email = session.user.email;
  const { name, password, bio, instrument, experienceYears, achievements, image } = payload;



  if (!name || !email || !password || !bio || !instrument || !experienceYears) {
    return { success: false, message: "All required fields must be filled" };
  }

  const instructorCollection = await dbConnect(collectionNamesObj.instructorCollection);

  // check if already exists
  const existingInstructor = await instructorCollection.findOne({ email });
  if (existingInstructor) {
    return { success: false, message: "Email already registered as instructor" };
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await instructorCollection.insertOne({
    name,
    email,
    password: hashedPassword,
    bio,
    instrument,
    experienceYears: Number(experienceYears),
    achievements: achievements || "",
    image,
    role: "instructor",
    createdAt: new Date(),
  });

  return {
    success: true,
    insertedId: result.insertedId.toString(),
    message: "Instructor registered successfully",
  };
}
