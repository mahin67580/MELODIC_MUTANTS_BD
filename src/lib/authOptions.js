import loginUser from "@/app/actions/auth/loginUser";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect, { collectionNamesObj } from "./dbconnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter Email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await loginUser(credentials);
        // ✅ loginUser should return { id, name, email, role }
        return user || null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { providerAccountId, provider } = account;
        const { email, image, name } = user;

        const userCollection = dbConnect(collectionNamesObj.userCollection);
        const isExisted = await userCollection.findOne({ providerAccountId });

        if (!isExisted) {
          // Default new Google users → "user" role
          const payload = {
            providerAccountId,
            provider,
            email,
            image,
            name,
            role: "user",
            createdAt: new Date(),
          };
          await userCollection.insertOne(payload);
        }
      }
      return true;
    },

    // ✅ Add role into JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "user"; // default to "user"
      }
      return token;
    },

    // ✅ Add role into session
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
