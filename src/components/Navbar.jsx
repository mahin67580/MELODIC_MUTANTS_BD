"use client"
import Image from 'next/image'
import logo from '../../public/assets/LOGO1.svg'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react"

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Icons
import { Menu, User, LogOut, Home, Users, BookOpen, Mail, Info } from 'lucide-react'

export default function Navbar() {
    const { data: session, status } = useSession()
    const [isInstructor, setIsInstructor] = useState(false)
    const pathname = usePathname()



    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/instructor/check")
                .then(res => res.json())
                .then(data => setIsInstructor(data.isInstructor))
        }
    }, [status])

    const isActive = (path) => pathname === path

    // Navigation items configuration
    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/about', label: 'About', icon: Info },
        { href: '/contact', label: 'Contact', icon: Mail },
        { href: '/allcourses', label: 'All Courses', icon: BookOpen },
        { href: '/instructors', label: 'Instructors', icon: Users },
    ]

    // Navigation links component
    const NavLinks = ({ mobile = false, onLinkClick }) => {
        const LinkWrapper = mobile ? 'div' : Link

        return navItems.map((item) => {
            const IconComponent = item.icon
            const linkContent = (
                <div
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    <IconComponent className="h-4 w-4" />
                    {item.label}
                </div>
            )

            return mobile ? (
                <Button
                    key={item.href}
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                >
                    <Link href={item.href} onClick={onLinkClick}>
                        <IconComponent className="h-4 w-4 mr-2" />
                        {item.label}
                    </Link>
                </Button>
            ) : (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    <IconComponent className="h-4 w-4" />
                    {item.label}
                </Link>
            )
        })
    }

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' })
    }

    const userHasImage = session?.user?.image
    const userInitial = session?.user?.name?.charAt(0).toUpperCase() ||
        session?.user?.email?.charAt(0).toUpperCase() || 'U'

    return (
        <nav className="sticky  top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="  flex h-16 items-center justify-between px-4 ">
                {/* Mobile menu */}
                <div className="flex items-center gap-4 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <div className="flex flex-col gap-4 py-4">

                                <nav className="flex flex-col gap-2">
                                    <NavLinks mobile={true} />
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center gap-2">
                        <h1 className='text-2xl  hover:scale-105 transition-transform duration-300  hover:rounded-3xl'>𝕸𝖊𝖑𝖔𝖉𝖎𝖈 𝕸𝖚𝖙𝖆𝖓𝖙𝖘</h1>
                    </Link>
                </div>

                {/* Desktop logo */}
                <div className="hidden md:flex items-center gap-2 ">
                    <Link href="/">
                        <h1 className='text-2xl  hover:scale-105 transition-transform duration-300  hover:rounded-3xl'>𝕸𝖊𝖑𝖔𝖉𝖎𝖈 𝕸𝖚𝖙𝖆𝖓𝖙𝖘</h1>
                    </Link>
                </div>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center  gap-8">
                    <NavLinks />
                </div>

                {/* User actions */}
                <div className="flex items-center gap-4">
                    {status === 'loading' ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    ) : status === 'authenticated' ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-12 w-12   rounded-full">
                                    <Avatar className="h-12 w-12 border-2 border-foreground">
                                        {userHasImage ? (
                                            <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                                        ) : null}
                                        <AvatarFallback className="bg-primary  text-primary-foreground">
                                            {userInitial}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56  " align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-xl font-medium leading-none">{session.user.name}</p>
                                        <p className="  leading-none text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" >Profile</Link>
                                </DropdownMenuItem>

                                {/* Role-based Dashboard */}
                                <DropdownMenuItem asChild>
                                    <Link href={
                                        session.user.role === "admin"
                                            ? "/dashboard/admindashboard/anlytics"
                                            : "/dashboard/userdashboard/anlytics"
                                    }>
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>

                                {/* Instructor logic */}
                                <DropdownMenuItem asChild>
                                    <Link href={
                                        isInstructor
                                            ? "/instructordashboard/addcourse"
                                            : "/instructorregister"
                                    }>
                                        {isInstructor ? "Instructor Dashboard" : "Become Instructor"}
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild>
                            <Link href="/login">Get Started</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}