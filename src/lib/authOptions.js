import loginUser from "@/app/actions/auth/loginUser";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect, { collectionNamesObj } from "./dbconnect"; // ✅ FIXED
import { signIn } from "next-auth/react";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log(credentials);
                const user = await loginUser(credentials);
                console.log("Authorized User:", user);
                return user || null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account }) {
           // console.log({ user, account })
            if (account) {
                const { providerAccountId, provider } = account
                const { email: user_email, image, name } = user

                const userCollection = dbConnect(collectionNamesObj.userCollection) // ✅ Works now
                const isExisted = await userCollection.findOne({ providerAccountId })

                if (!isExisted) {
                    const payload = {
                        providerAccountId,
                        provider,
                        email: user_email,
                        image,
                        name,
                    }
                    await userCollection.insertOne(payload)
                }
            }
            return true
        },
    }
}
