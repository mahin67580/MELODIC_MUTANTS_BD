import Dashnav from '@/components/Dashnav'
import React from 'react'

export default function layout({ children }) {
    return (
        <div className='grid grid-cols-12'>
            <div className='col-span-2 p-3   h-screen sticky top-0'>
                <Dashnav></Dashnav>
            </div>
            <div className='col-span-10'>
                {children}
            </div>

        </div>
    )
}
