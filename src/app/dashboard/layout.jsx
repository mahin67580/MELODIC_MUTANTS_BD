// app/dashboard/layout.jsx
import Adminnav from '@/components/Adminnav'
import Dashnav from '@/components/Dashnav'
import { BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/authOptions'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export default async function Layout({ children }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role || "user";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:block border-r">
          <SidebarHeader className="p-6">
            <Link href="/">
              <div className="flex items-center text-2xl text-blue-600 hover:text-blue-700 transition-colors">
                <BarChart3 className="mr-2" size={24} />

                <span className="font-semibold">
                  {role === "admin" ? "Admin Dashboard" : "Dashboard"}
                </span>

              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-4">
            {role === "admin" ? <Adminnav /> : <Dashnav />}
          </SidebarContent>
        </Sidebar>

        {/* Mobile Header with Sheet */}
        <div className="flex-1 flex flex-col">
          <header className="lg:hidden sticky top-0 z-40 bg-background border-b">
            <div className="flex h-16 items-center justify-between px-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <div className="p-4">
                    <Link href="/">
                      <div className="flex items-center text-2xl text-blue-600 mb-8">
                        <BarChart3 className="mr-2" size={24} />
                        <span className="font-semibold">
                          {role === "admin" ? "Admin Dashboard" : "Dashboard"}
                        </span>
                      </div>
                    </Link>
                    {role === "admin" ? <Adminnav /> : <Dashnav />}
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/">
                <div className="flex items-center text-xl text-blue-600 lg:hidden">
                  <BarChart3 className="mr-2" size={20} />
                  <span className="font-semibold">
                    {role === "admin" ? "Admin Dashboard" : "Dashboard"}
                  </span>
                </div>
              </Link>

              <div className="w-9"></div> {/* Spacer for balance */}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}