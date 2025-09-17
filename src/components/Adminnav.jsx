"use client"
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation' // Import usePathname

export default function Adminnav() {
    const pathname = usePathname() // Get current path

    // Function to check if a link is active
    const isActive = (path) => {
        return pathname === path
    }

    return (
        <div>
            <ul className='flex flex-col gap-4'>
                <Link
                    href={'/dashboard/admindashboard/anlytics'}
                    className={`btn ${isActive('/dashboard/admindashboard/anlytics') ? 'btn-primary' : ''}`}
                >
                    <li>Analytics</li>
                </Link>

                <Link
                    href={'/dashboard/admindashboard/addcourse'}
                    className={`btn ${isActive('/dashboard/admindashboard/addcourse') ? 'btn-primary' : ''}`}
                >
                    <li>Add Course</li>
                </Link>
                <Link
                    href={'/dashboard/admindashboard/managecourse'}
                    className={`btn ${isActive('/dashboard/admindashboard/managecourse') ? 'btn-primary' : ''}`}
                >
                    <li>Manage Course</li>
                </Link>
                <Link
                    href={'/dashboard/admindashboard/manageuser'}
                    className={`btn ${isActive('/dashboard/admindashboard/manageuser') ? 'btn-primary' : ''}`}
                >
                    <li>Manage User</li>
                </Link>



            </ul>
        </div>
    )
}