 "use server"

import dbConnect, { collectionNamesObj } from "@/lib/dbconnect";
import bcrypt from "bcrypt";
export default async function loginUser(payload) {
   const { email, password } = payload;

   const userCollection = dbConnect(collectionNamesObj.userCollection);
    const user = await userCollection.findOne({ email });
    if (!user) {
        return { success: false, message: "Invalid email or password" };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return { success: false, message: "Invalid email or password" };
    }

    return user 
}

