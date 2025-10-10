import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";


export const middleware = async (req) => {
    // console.log("Middleware active for path:", req.nextUrl.pathname);

    const token = await getToken({
        req,
        // secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === "production" ? true : false,
    })

    if (token) {

        return NextResponse.next()
    } else {
        return NextResponse.redirect(new URL('/login', req.url))
    }
}

export const config = {
    matcher: [
        '/my-bookings',
        '/dashboard',
        '/dashboard/:path*',
        '/my-bookings/:path*',
        '/chechout/:path*',
    ],
}