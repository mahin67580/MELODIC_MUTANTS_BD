"use server"

import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import bcrypt from "bcrypt";

export default async function loginUser(payload) {
   const { email, password } = payload;

   try {
      const userCollection = await dbConnect(collectionNamesObj.userCollection);
      const user = await userCollection.findOne({ email });
      
      if (!user) {
          return null; // Return null instead of error object
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return null; // Return null instead of error object
      }

      // Return user object in the format NextAuth expects
      return {
          id: user._id?.toString(),
          email: user.email,
          name: user.name,
          role: user.role
      };
   } catch (error) {
      console.error("Login error:", error);
      return null;
   }
}