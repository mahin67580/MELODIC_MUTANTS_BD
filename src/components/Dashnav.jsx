import Link from 'next/link'
import React from 'react'

export default function Dashnav() {
    return (
        <div>

            <ul className='flex flex-col gap-4'>
                <Link href={'/dashboard/userdashboard/mybookings'} className=' btn'><li>My Bookings</li></Link>
                <Link href={'/dashboard/userdashboard/mycourses'} className=' btn'><li>My Courses</li></Link>
                <Link href={''} className=' btn'><li>Analytics</li></Link>
                <Link href={'/'} className=' btn'><li>Home</li></Link>
            </ul>

        </div>
    )
}
