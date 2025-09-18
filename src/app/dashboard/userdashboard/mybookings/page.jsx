"use client"
import React, { useEffect, useState } from 'react'
// import DeleteBookingButton from './components/DeleteBookingButton'
import Swal from 'sweetalert2'
import Link from 'next/link'

export default function MyBookingsPage() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/lesson`)
            const bookings = await res.json()
            setData(bookings)
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }



    // const handleEdit = (id) => {
        
    //     console.log('Edit booking with id:', id)
    //     alert(`Edit functionality for booking ${id} would be implemented here`)
    // }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/lesson/${id}`, {
                    method: 'DELETE',
                })

                if (!res.ok) {
                    throw new Error(`Failed with status ${res.status}`)
                }

                setData((prevData) => prevData.filter((item) => item._id !== id))

                Swal.fire('Deleted!', 'Booking has been deleted.', 'success')
            } catch (error) {
                console.error('Error deleting booking:', error)
                Swal.fire('Error!', 'Something went wrong while deleting.', 'error')
            }
        }
    }


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

                {data.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-600">No bookings found.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View (hidden on mobile) */}
                        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Lesson</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Method</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.map((booking) => (
                                            <tr key={booking._id} className="hover:bg-gray-50">
                                                 
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{booking.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{booking.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{booking.lessonTitle}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">${booking.price}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                                        {booking.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link href={`/dashboard/userdashboard/mybookings/${booking._id}`}>
                                                            <button
                                                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md text-xs font-medium"
                                                            >
                                                                Edit
                                                            </button>
                                                        </Link>

                                                        <button
                                                            onClick={() => handleDelete(booking._id)}
                                                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md text-xs font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View (shown on mobile) */}
                        <div className="md:hidden space-y-4">
                            {data.map((booking) => (
                                <div key={booking._id} className="bg-white rounded-lg shadow p-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-semibold text-gray-800">{booking.lessonTitle}</h3>
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                                {booking.paymentMethod}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs text-gray-500">Name</p>
                                                <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Price</p>
                                                <p className="text-sm font-medium text-gray-900">${booking.price}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm font-medium text-gray-900 truncate">{booking.email}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-500">Phone</p>
                                                <p className="text-sm font-medium text-gray-900">{booking.phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2 pt-2 border-t border-gray-100">
                                            <button
                                                onClick={() => handleEdit(booking._id)}
                                                className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-2 rounded-md text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            {/* <DeleteBookingButton id={booking._id}></DeleteBookingButton> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}