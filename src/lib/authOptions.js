import loginUser from "@/app/actions/auth/loginUser";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { collectionNamesObj, dbConnect } from "./dbconnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter Email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          
          const user = await loginUser(credentials);
          
          if (user) {
            return user;
          } else {
            // Throw specific errors that can be caught in the login component
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          console.error("Authorization error:", error);
          // Re-throw the error so it propagates to the signIn callback
          throw new Error("Authentication failed");
        }
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
    async signIn({ user, account, credentials }) {
      // Only handle Google sign-ins
      if (account?.provider === "google") {
        const { providerAccountId, provider } = account;
        const { email, image, name } = user;

        try {
          const userCollection = await dbConnect(collectionNamesObj.userCollection);
          const isExisted = await userCollection.findOne({ providerAccountId });

          if (!isExisted) {
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
        } catch (error) {
          console.error("Error handling Google sign-in:", error);
          return false; // Prevent sign-in if there's an error
        }
      }
      
      // For credentials provider, always allow if we got this far
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "user";
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  // Add session strategy for better error handling
  session: {
    strategy: "jwt",
  },
  // Enable debug mode in development for better error tracking
  //debug: process.env.NODE_ENV === "development",
};