
"use client"
import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Swal from "sweetalert2"

export default function BookingUpdateform({ params }) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
   
    phone: "",
    paymentMethod: "credit-card",
  })

  const [lesson, setLesson] = useState(null)

//   useEffect(() => {
//     const fetchLesson = async () => {
//       const { id } = await params
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/lesson/${id}`,
//         { cache: "no-store" }
//       )
//       const data = await res.json()
//       setLesson(data)

//       setFormData((prev) => ({
//         ...prev,
//         lessonTitle: data.title,
//         price: data.price,
//         id: data._id,
//       }))
//     }
//     fetchLesson()
//   }, [params])

  useEffect(() => {
    if (status === "authenticated") {
      setFormData((prev) => ({
        ...prev,
        name: session?.user?.name || "",
        email: session?.user?.email || "",
      }))
    }
  }, [session, status])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
    
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/lesson`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       )
      
//       if (res.ok) {
//         // Show success alert
//         await Swal.fire({
//           title: "Success!",
//           text: "Your booking has been confirmed successfully!",
//           icon: "success",
//           confirmButtonColor: "#3B82F6",
//           confirmButtonText: "Continue Learning"
//         })
        
//         // Reset form if needed
//         setFormData(prev => ({
//           ...prev,
//           phone: "",
//           paymentMethod: "credit-card"
//         }))
//       } else {
//         throw new Error("Booking failed")
//       }
//     } catch (error) {
//       // Show error alert
//       await Swal.fire({
//         title: "Error!",
//         text: "There was a problem processing your booking. Please try again.",
//         icon: "error",
//         confirmButtonColor: "#EF4444",
//         confirmButtonText: "Try Again"
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (!lesson) return <p className="text-center py-8">Loading lesson details...</p>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lesson Summary Section */}
          <div className="w-full lg:w-2/5 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Lesson Summary</h2>

            <img
              src={lesson.thumbnail}
              alt={lesson.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-gray-700">Title</h3>
                <p className="text-lg font-semibold">{lesson.title}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Description</h3>
                <p className="text-gray-600 line-clamp-3">{lesson.description}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium text-gray-700">Total</span>
                <span className="text-2xl font-bold text-blue-600">${lesson.price}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form Section */}
          <div className="w-full lg:w-3/5 bg-white p-6 rounded-lg shadow-md">
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
                <label className="block font-medium mb-2">Phone Number</label>
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
                <label className="block font-medium mb-2">Payment Method</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className={`border rounded-md p-4 cursor-pointer ${formData.paymentMethod === 'credit-card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setFormData({ ...formData, paymentMethod: 'credit-card' })}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={formData.paymentMethod === "credit-card"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 font-medium">Credit Card</label>
                    </div>
                  </div>

                  <div className={`border rounded-md p-4 cursor-pointer ${formData.paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === "paypal"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 font-medium">PayPal</label>
                    </div>
                  </div>

                  <div className={`border rounded-md p-4 cursor-pointer ${formData.paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setFormData({ ...formData, paymentMethod: 'stripe' })}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={formData.paymentMethod === "stripe"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 font-medium">Stripe</label>
                    </div>
                  </div>
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
                  `Update Booking-Info`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}