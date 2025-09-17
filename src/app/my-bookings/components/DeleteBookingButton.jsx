"use client"
import { useRouter } from 'next/navigation'; // Change from 'next/router'
import React from 'react'

export default function DeleteBookingButton({ id }) {
    const router = useRouter();
    
    const handleDelete = async (id) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/lesson/${id}`,
            {
                method: "DELETE",
            }
        );
        const data = await res.json();
        console.log(data);
        router.refresh(); // This will refresh the page data
    };

    return (
        <button
            onClick={() => handleDelete(id)}
            className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-md text-sm font-medium"
        >
            Delete
        </button>
    )
}