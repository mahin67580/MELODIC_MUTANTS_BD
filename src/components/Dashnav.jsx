"use client"
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation' // Import usePathname

export default function Dashnav() {
    const pathname = usePathname() // Get current path

    // Function to check if a link is active
    const isActive = (path) => {
        return pathname === path
    }

    return (
        <div>
            <ul className='flex flex-col gap-4'>
                <Link
                    href={'/dashboard/userdashboard/anlytics'}
                    className={`btn ${isActive('/dashboard/userdashboard/anlytics') ? 'btn-primary' : ''}`}
                >
                    <li>Analytics</li>
                </Link>

                <Link
                    href={'/dashboard/userdashboard/mybookings'}
                    className={`btn ${isActive('/dashboard/userdashboard/mybookings') ? 'btn-primary' : ''}`}
                >
                    <li>My Bookings</li>
                </Link>
                <Link
                    href={'/dashboard/userdashboard/mycourses'}
                    className={`btn ${isActive('/dashboard/userdashboard/mycourses') ? 'btn-primary' : ''}`}
                >
                    <li>My Courses</li>
                </Link>

                <Link
                    href={'/'}
                    className={`btn ${isActive('/') ? 'btn-primary' : ''}`}
                >
                    <li>Wish-List</li>
                </Link>

            </ul>
        </div>
    )
}