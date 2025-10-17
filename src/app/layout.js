
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import ClientLayout from "./ClientLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Melodic Mutants - Music Education Platform",
  description: "Join Melodic Mutants for interactive music lessons, instrument training, and community collaboration. Learn music the modern way.",
  keywords: "music lessons, instruments, learning, education, melodic mutants",
  authors: [{ name: "MD Afjal Hossain" }],
  creator: "MD Afjal Hossain",
  publisher: "Melodic Mutants",

};


export default async function RootLayout({ children }) {


  const session = await getServerSession(authOptions);
  let isInstructor = false;

  if (session?.user?.email) {
    const instructorCollection = await dbConnect(collectionNamesObj.instructorCollection);
    const instructor = await instructorCollection.findOne({ email: session.user.email });
    isInstructor = !!instructor;
  }

  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/public/melodic-mutants-logo.svg" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextAuthProvider>
          <ClientLayout session={session} isInstructor={isInstructor}>{children}</ClientLayout>
        </NextAuthProvider>
      </body>
    </html>
  );
}
