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
    async signIn({ user, account, profile }) {
      try {
        // Handle Google sign-ins
        if (account?.provider === "google") {
          const { email, image, name } = user;

          if (!email) {
            console.error("No email provided by Google");
            return false;
          }

          const userCollection = await dbConnect(collectionNamesObj.userCollection);
          
          // Check if user already exists by email (more reliable than providerAccountId)
          const existingUser = await userCollection.findOne({ email });

          if (!existingUser) {
            // Create new user for Google sign-in with complete profile structure
            const newUser = {
              name: name || profile?.name || '',
              email: email,
              image: image || profile?.picture || '',
              role: "user",
              createdAt: new Date(),
              updatedAt: new Date(),
              // Add all profile fields with empty defaults
              phone: '',
              bio: '',
              favoriteInstruments: [],
              favoriteGenres: [],
              skillLevel: '',
              yearsOfExperience: 0,
              practiceFrequency: '',
              musicalGoals: '',
              influences: '',
              youtubeUrl: '',
              spotifyUrl: '',
              soundcloudUrl: '',
              // Store provider information
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            };
            
            const result = await userCollection.insertOne(newUser);
            
            // Add the MongoDB _id to the user object for session
            user.id = result.insertedId.toString();
            user.role = "user";
          } else {
            // User exists, update their information and set the ID
            user.id = existingUser._id.toString();
            user.role = existingUser.role || "user";
            
            // Update user image and name if they changed
            if (image && image !== existingUser.image) {
              await userCollection.updateOne(
                { _id: existingUser._id },
                { 
                  $set: { 
                    image: image,
                    name: name || existingUser.name,
                    updatedAt: new Date()
                  } 
                }
              );
            }
          }
        }
        
        // For credentials provider, user.id should already be set by loginUser
        return true;
        
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Prevent sign-in if there's an error
      }
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user && account) {
        token.role = user.role || "user";
        token.id = user.id;
        
        // For Google users, ensure we have the ID
        if (account.provider === "google" && user.id) {
          token.id = user.id;
        }
      }
      
      return token;
    },

    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      
      if (token?.id) {
        session.user.id = token.id;
      }
      
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  // Enable debug mode in development for better error tracking
  debug: process.env.NODE_ENV === "development",
};