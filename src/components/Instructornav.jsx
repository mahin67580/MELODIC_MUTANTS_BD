"use client"
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation' // Import usePathname

export default function instructornav() {
    const pathname = usePathname() // Get current path
    //console.log(pathname);

    // Function to check if a link is active
    const isActive = (path) => {
        return pathname === path
    }

    return (
        <div>
            <ul className='flex flex-col gap-4'>
                <Link
                    href={'/instructordashboard/anlytics'}
                    className={`btn ${isActive('/instructordashboard/anlytics') ? 'btn-primary' : ''}`}
                >
                    <li>Analytics</li>
                </Link>

                <Link
                    href={'/instructordashboard/addcourse'}
                    className={`btn ${isActive('/instructordashboard/addcourse') ? 'btn-primary' : ''}`}
                >
                    <li>Add Course</li>
                </Link>
                <Link
                    href={'/instructordashboard/managecourse'}
                    className={`btn ${isActive('/instructordashboard/managecourse') ? 'btn-primary' : ''}`}
                >
                    <li>Manage Course</li>
                </Link>
                <Link
                    href={'/instructordashboard/updatebio'}
                    className={`btn ${isActive('/instructordashboard/updatebio') ? 'btn-primary' : ''}`}
                >
                    <li>Update Bio</li>
                </Link>



            </ul>
        </div>
    )
}