"use client"
import Image from 'next/image'
import React from 'react'
import logo from '../../public/assets/LOGO1.svg'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
    const { data: session, status } = useSession()
    
    const links = () => {
        return (
            <>
                <Link href={'/'}><li className='btn w-30 mb-4 lg:mb-0 mr-2'>Home</li></Link>
                <Link href={'/uploadcourse'}><li className='btn mb-4 lg:mb-0 w-30 mr-2'>Up-course</li></Link>
                <Link href={'/mycourses'}><li className='btn mb-4 lg:mb-0 w-30 mr-2'>MY-Course</li></Link>
                <Link href={'/my-bookings'}><li className='btn mb-4 lg:mb-0 w-30 mr-2'>My Booking</li></Link>
            </>
        )
    }

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' })
    }

    // Check if user has an image in session (from social login)
    const userHasImage = session?.user?.image

    return (
        <div className="navbar bg-base-100 shadow-sm z-10 top-0 sticky">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 p-2 shadow">
                        {links()}                     
                    </ul>
                </div>
                <Link href={'/'}>  
                    <Image
                        src={logo}
                        width={50}
                        height={50}
                        alt="Music Note Logo"
                        className="border-2 border-amber-500 rounded-full transition-transform duration-300 hover:scale-110 hover:shadow-lg"
                    />
                </Link>
            </div>
            {/* desktop view */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links()}
                </ul>
            </div>
            <div className="navbar-end">
                {status === 'loading' ? (
                    // Loading state
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                ) : status === 'authenticated' ? (
                    // User is logged in - show profile dropdown
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            {userHasImage ? (
                                // Show user's profile image if available
                                <div className="w-10 rounded-full border-2 border-black">
                                    <Image
                                        src={session.user.image}
                                        width={40}
                                        height={40}
                                        alt="User Profile"
                                        className="rounded-full"
                                        onError={(e) => {
                                            // Fallback to initial if image fails to load
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    {/* Fallback initial - hidden by default */}
                                    <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center border-2 border-black hidden">
                                        <span className="text-sm font-bold">
                                            {session?.user?.name?.charAt(0).toUpperCase() || 
                                             session?.user?.email?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                // Show initial if no image available
                                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center border-2 border-black">
                                    <span className="text-sm font-bold">
                                        {session?.user?.name?.charAt(0).toUpperCase() || 
                                         session?.user?.email?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                            )}
                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li className="px-4 py-2 border-b">
                                <div className="font-medium truncate">{session?.user?.name}</div>
                                <div className="text-xs text-gray-500 truncate">{session?.user?.email}</div>
                            </li>
                            <li><Link href="/profile">Profile</Link></li>
                            <li><Link href="/dashboard">Dashboard</Link></li>
                            <li><Link href="/settings">Settings</Link></li>
                            <li className="border-t mt-2">
                                <button 
                                    onClick={handleSignOut}
                                    className="btn btn-ghost btn-sm w-full justify-start"
                                >
                                    Sign Out
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    // User is not logged in - show Get Started button
                    <Link href={'/register'}>
                        <button className="btn btn-primary">Get Started</button>
                    </Link>
                )}
            </div>
        </div>
    )
}