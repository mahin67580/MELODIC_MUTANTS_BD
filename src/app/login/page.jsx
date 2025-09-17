'use client'

import React, { useState, useEffect } from 'react'
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [socialLoading, setSocialLoading] = useState(false)
    const router = useRouter()
    const { data: session, status } = useSession()

    // Redirect to home if already authenticated
    useEffect(() => {
        if (status === 'authenticated') {
            // Show success message when redirected after login
            Swal.fire({
                title: 'Welcome back!',
                text: 'You have successfully logged in.',
                icon: 'success',
                confirmButtonText: 'Continue',
                timer: 2000,
                timerProgressBar: true,
            }).then(() => {
                router.push('/')
            })
        }
    }, [status, router])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false
            })

            if (result?.error) {
                await Swal.fire({
                    title: 'Login Failed',
                    text: 'Invalid email or password. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#3085d6',
                })
            } else {
                await Swal.fire({
                    title: 'Success!',
                    text: 'You have successfully logged in.',
                    icon: 'success',
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#3085d6',
                    timer: 1500,
                    timerProgressBar: true,
                })
                // The useEffect will handle the redirect when session becomes authenticated
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
        
        // Show loading alert for social login
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
                    confirmButtonColor: '#3085d6',
                    timer: 1500,
                    timerProgressBar: true,
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
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        )
    }

    // Don't render the login form if already authenticated (will redirect)
    if (status === 'authenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to home page...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Submit Button with Loading Spinner */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </>
                        ) : (
                            'Login with Email'
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-600">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Google Login Button */}
                    <button 
                        onClick={() => handleSocialLogin("google")} 
                        disabled={socialLoading}
                        type="button" 
                        className="w-full py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {socialLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Connecting...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-4 text-gray-600 text-center">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">Register</a>
                </p>
            </div>
        </div>
    )
}