"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children, session = { session }, isInstructor = { isInstructor } }) {
  const pathname = usePathname();


  const hiddenPaths = ["/dashboard", "/instructordashboard"];
  const hideNavbar = hiddenPaths.some(path => pathname.startsWith(path));

  return (
    <>
      {!hideNavbar && <Navbar session={session} isInstructor={isInstructor} />}
      {children}
      {!hideNavbar && <Footer />}

    </>
  );
}
