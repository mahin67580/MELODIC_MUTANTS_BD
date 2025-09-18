"use server"

import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import bcrypt from "bcrypt";

export default async function RegisterUser(payload) {
  const { name, email, password } = payload;

  if (!name || !email || !password) {
    return { success: false, message: "All fields are required" };
  }

  const userCollection = await dbConnect(collectionNamesObj.userCollection);

  // check if user already exists
  const existingUser = await userCollection.findOne({ email });
  if (existingUser) {
    return { success: false, message: "Email already registered" };
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert new user
  const result = await userCollection.insertOne({
    name,
    email,
    password: hashedPassword,
    role: "user",        // default role
    createdAt: new Date(),
  });

  return {
    success: true,
    insertedId: result.insertedId.toString(),
    message: "User registered successfully",
  };
}
