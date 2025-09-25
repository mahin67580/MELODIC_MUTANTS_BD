"use client"
import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"

export default function BookingUpdateForm({ params }) {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        lessonTitle: "",
        price: "",
        paymentMethod: "credit-card",
    })

    const [lesson, setLesson] = useState(null)

    // Fetch booking details
    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const { id } = await params
                const res = await fetch(`/api/my-bookings/${id}`, { cache: "no-store" })
                const data = await res.json()

                setLesson(data)
                setFormData(prev => ({
                    ...prev,
                    id: data._id,
                    lessonTitle: data.lessonTitle,
                    price: data.price,
                    phone: data.phone || "",
                    paymentMethod: data.paymentMethod || "credit-card",
                }))

            } catch (err) {
                console.error("Failed to fetch lesson:", err)
            }
        }

        fetchLesson()
    }, [params])

    // Prefill user info if authenticated
    useEffect(() => {
        if (status === "authenticated") {
            setFormData(prev => ({
                ...prev,
                name: session?.user?.name || "",
                email: session?.user?.email || "",
            }))
        }
    }, [session, status])

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch(`/api/my-bookings/${formData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone, paymentMethod: formData.paymentMethod }),
            })

            let result = {}
            try {
                result = await res.json()
            } catch (err) {
                console.warn("No JSON returned from server", err)
            }

            if (res.ok) {
                await Swal.fire({
                    title: "Success!",
                    text: result.message || "Booking updated successfully!",
                    icon: "success",
                    confirmButtonColor: "#3B82F6",
                })

                // Redirect after user clicks "OK"
                router.push('/dashboard/userdashboard/mybookings')
            } else {
                throw new Error(result.message || "Update failed")
            }
        } catch (err) {
            await Swal.fire({
                title: "Error!",
                text: err.message,
                icon: "error",
                confirmButtonColor: "#EF4444",
            })
        } finally {
            setIsLoading(false)
        }
    }


    if (!lesson) return <p className="text-center py-8">Loading lesson details...</p>

    return (
        <div className="min-h-screen">
            <div className="">
                <h1 className="text-3xl font-bold   mb-8">𝖀𝖕𝖉𝖆𝖙𝖊 𝕭𝖔𝖔𝖐𝖎𝖓𝖌</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Lesson Summary */}


                    {/* Checkout Form */}
                    <div className="w-full   bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Payment Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block font-medium mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium mb-2">*Update Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g. +1234567890"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block font-medium mb-2">Lesson</label>
                                    <input
                                        type="text"
                                        name="lessonTitle"
                                        value={formData.lessonTitle}
                                        readOnly
                                        className="w-full border px-4 py-3 rounded-md bg-gray-50 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-2">Price</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={`$${formData.price}`}
                                        readOnly
                                        className="w-full border px-4 py-3 rounded-md bg-gray-50 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium mb-2">*Update Payment Method</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {["credit-card", "paypal", "stripe"].map(method => (
                                        <div
                                            key={method}
                                            className={`border rounded-md p-4 cursor-pointer ${formData.paymentMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method}
                                                    checked={formData.paymentMethod === method}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label className="ml-2 font-medium">{method.replace("-", " ").toUpperCase()}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium text-lg transition-colors shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    "Update Booking-Info"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
