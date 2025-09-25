"use client"
import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, CreditCard, Mail, Phone, User, BookOpen, DollarSign, CheckCircle2 } from "lucide-react"

export default function CheckoutPage({ params }) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [alreadyBooked, setAlreadyBooked] = useState(false)
  const router = useRouter()

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

  useEffect(() => {
    const fetchLesson = async () => {
      const { id } = await params
      const res = await fetch(`/api/lesson/${id}`, { cache: "no-store" })
      const data = await res.json()
      setLesson(data)

      setFormData((prev) => ({
        ...prev,
        lessonTitle: data.title,
        price: data.price,
        id: data._id,
      }))
    }
    fetchLesson()
  }, [params])

  useEffect(() => {
    if (status === "authenticated") {
      setFormData((prev) => ({
        ...prev,
        name: session?.user?.name || "",
        email: session?.user?.email || "",
      }))
    }
  }, [session, status])

  useEffect(() => {
    const checkBooking = async () => {
      if (status === "authenticated" && lesson?._id) {
        const res = await fetch(`/api/lesson?lessonId=${lesson._id}`, { cache: "no-store" })
        const data = await res.json()
        if (data.length > 0) {
          setAlreadyBooked(true)
        }
      }
    }
    checkBooking()
  }, [status, lesson])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1️⃣ First, save enrollment details (POST)
      const postRes = await fetch(`/api/lesson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!postRes.ok) {
        throw new Error("Failed to save enrollment details")
      }

      // 2️⃣ Then, increment enrolledStudents (PATCH)
      const patchRes = await fetch(`/api/courses/${formData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enroll: true }),
      })

      if (!patchRes.ok) {
        throw new Error("Failed to update course enrollment count")
      }

      // ✅ Success Alert
      await Swal.fire({
        title: "Success!",
        text: "Your booking has been confirmed successfully!",
        icon: "success",
        confirmButtonColor: "#3B82F6",
        confirmButtonText: "Continue Learning"
      })

      // 👇 Redirect to My Courses
      router.push("/dashboard/userdashboard/mycourses")

      // Reset form if needed
      setFormData(prev => ({
        ...prev,
        phone: "",
        paymentMethod: "credit-card"
      }))
    } catch (error) {
      console.error(error)
      await Swal.fire({
        title: "Error!",
        text: "There was a problem processing your booking. Please try again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
        confirmButtonText: "Try Again"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!lesson) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground mt-2">Complete your enrollment</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lesson Summary Section */}
          <div className="w-full lg:w-2/5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lesson Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{lesson.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {lesson.level}
                    </Badge>
                    <Badge variant="outline">
                      {lesson.instrument}
                    </Badge>
                  </div>

                  {lesson.instructor?.name && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {lesson.instructor.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{lesson.instructor.name}</p>
                        <p className="text-xs text-muted-foreground">Instructor</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">${lesson.price}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form Section */}
          <div className="w-full lg:w-3/5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Enter your information to complete the enrollment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1234567890"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="lessonTitle" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Lesson
                      </Label>
                      <Input
                        id="lessonTitle"
                        name="lessonTitle"
                        value={formData.lessonTitle}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Price
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        value={`$${formData.price}`}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Payment Method</Label>
                    <RadioGroup 
                      value={formData.paymentMethod} 
                      onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="credit-card" id="credit-card" className="sr-only" />
                        <Label
                          htmlFor="credit-card"
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                            formData.paymentMethod === "credit-card" ? "border-primary" : ""
                          }`}
                        >
                          <CreditCard className="mb-3 h-6 w-6" />
                          Credit Card
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
                        <Label
                          htmlFor="paypal"
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                            formData.paymentMethod === "paypal" ? "border-primary" : ""
                          }`}
                        >
                          <CreditCard className="mb-3 h-6 w-6" />
                          PayPal
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="stripe" id="stripe" className="sr-only" />
                        <Label
                          htmlFor="stripe"
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                            formData.paymentMethod === "stripe" ? "border-primary" : ""
                          }`}
                        >
                          <CreditCard className="mb-3 h-6 w-6" />
                          Stripe
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || alreadyBooked}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {alreadyBooked ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Already Enrolled
                      </>
                    ) : isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Confirm Payment - $${lesson.price}`
                    )}
                  </Button>

                  {alreadyBooked && (
                    <p className="text-center text-sm text-muted-foreground">
                      You are already enrolled in this course. Visit your dashboard to continue learning.
                    </p>
                  )}
                </form>
              </CardContent>
              <CardFooter>
                <div className="w-full text-center">
                  <p className="text-xs text-muted-foreground">
                    Your payment is secure and encrypted. By completing this purchase, you agree to our terms of service.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}