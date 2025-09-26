'use client'

import React, { useState, useEffect } from 'react'
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react"
 
export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [socialLoading, setSocialLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const router = useRouter()
    const { data: session, status } = useSession()

    // Redirect to home if already authenticated
    useEffect(() => {
        if (status === 'authenticated') {
            Swal.fire({
                title: `Welcome ${session?.user?.name} !`,
                text: 'You have successfully logged in.',
                icon: 'success',
                confirmButtonText: 'Continue',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                color: '#000000',
                timer: 2000,
                timerProgressBar: true,
                customClass: {
                    popup: 'rounded-xl shadow-lg',
                },
            }).then(() => {
                router.push('/')
            })
        }
    }, [status, router, session?.user?.name])

    // Validation function
    const validateForm = () => {
        const newErrors = {}

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email format is invalid'
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' })
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validate form before submission
        if (!validateForm()) {
            await Swal.fire({
                title: 'Validation Error',
                text: 'Please fix the errors in the form before submitting.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            })
            return
        }

        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false
            })

            if (result?.error) {
                // Specific error handling based on error message
                let errorMessage = 'Invalid email or password. Please try again.'
                
                if (result.error.includes('user') || result.error.includes('email')) {
                    errorMessage = 'No account found with this email address.'
                } else if (result.error.includes('password')) {
                    errorMessage = 'Incorrect password. Please try again.'
                }

                await Swal.fire({
                    title: 'Login Failed',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#3085d6',
                })

                // Set specific field errors
                if (result.error.includes('user') || result.error.includes('email')) {
                    setErrors({ ...errors, email: 'Account not found with this email' })
                } else if (result.error.includes('password')) {
                    setErrors({ ...errors, password: 'Incorrect password' })
                }

            } else {
                // Success - wait for session to update and useEffect will handle redirect
                await Swal.fire({
                    title: 'Success!',
                    text: 'You have successfully logged in.',
                    icon: 'success',
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    color: '#000000',
                    timer: 1500,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'rounded-xl shadow-lg',
                    },
                })
                // The useEffect hook will handle the redirect when status becomes 'authenticated'
            }
        } catch (error) {
            console.error("Login error:", error)
            await Swal.fire({
                title: 'Error!',
                text: 'An unexpected error occurred. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialLogin = async (provider) => {
        setSocialLoading(true)

        Swal.fire({
            title: 'Connecting...',
            text: 'Please wait while we connect to your account',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })

        try {
            const result = await signIn(provider, {
                callbackUrl: '/',
                redirect: false
            })

            if (result?.error) {
                Swal.close()
                await Swal.fire({
                    title: 'Login Failed',
                    text: result.error || 'Failed to login with Google. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#3085d6',
                })
            } else {
                Swal.close()
                await Swal.fire({
                    title: 'Success!',
                    text: 'You have successfully logged in with Google.',
                    icon: 'success',
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    color: '#000000',
                    timer: 1500,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'rounded-xl shadow-lg',
                    },
                })
            }

        } catch (error) {
            console.error("Social login error:", error)
            Swal.close()
            await Swal.fire({
                title: 'Error!',
                text: 'An unexpected error occurred during social login. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            })
        } finally {
            setSocialLoading(false)
        }
    }

    // Show loading state while checking authentication
    if (status === 'loading') {
        return (
            <div
                className="min-h-screen flex items-center justify-center relative"
                style={{
                    backgroundImage:  "url('/bgimg.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                <Card className="w-full max-w-md relative z-10">
                    <CardContent className="p-8 text-center">
                        <Spinner className="h-8 w-8 mx-auto mb-4" />
                        <p className="text-gray-600">Checking authentication...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Don't render the login form if already authenticated (will redirect)
    if (status === 'authenticated') {
        return (
            <div
                className="min-h-screen flex items-center justify-center relative"
                style={{
                    backgroundImage:  "url('/bgimg.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                <Card className="w-full max-w-md relative z-10">
                    <CardContent className="p-8 text-center">
                        <Spinner className="h-8 w-8 mx-auto mb-4" />
                        <p className="text-gray-600">Redirecting to home page...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative"
            style={{
                backgroundImage:  "url('/bgimg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            <Card className="w-full max-w-md relative z-10 border-0 shadow-xl">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-black rounded-full flex items-center justify-center">
                        <LogIn className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription className="text-gray-600">
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`pl-10 pr-4 py-2 h-11 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={`pl-10 pr-10 py-2 h-11 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="Enter your password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        {/* <div className="text-right">
                            <a 
                                href="/forgot-password" 
                                className="text-sm text-blue-600 hover:text-blue-700 underline"
                            >
                                Forgot your password?
                            </a>
                        </div> */}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-black text-white font-semibold hover:bg-gray-800"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner className="h-4 w-4 mr-2" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Sign In
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Separator */}
                    <div className="relative my-6">
                        <Separator />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-white px-2 text-sm text-gray-500">or continue with</span>
                        </div>
                    </div>

                    {/* Google Login Button */}
                    <Button
                        onClick={() => handleSocialLogin("google")}
                        disabled={socialLoading}
                        variant="outline"
                        className="w-full h-11 font-semibold"
                    >
                        {socialLoading ? (
                            <>
                                <Spinner className="h-4 w-4 mr-2" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </Button>

                    {/* Register Link */}
                    <div className="text-center pt-4">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4 transition-colors"
                            >
                                Create one now
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}