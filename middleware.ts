import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(){
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({token, req}) => {
                const {pathname} = req.nextUrl
                if(
                    (pathname.startsWith('/api/auth') && (pathname.endsWith('/login') || pathname.endsWith('/register'))) || pathname.startsWith('/api/videos')  
                ){
                    return true
                }
                return !!token
            }
        }
    }
) // middleware is fired only whern the authorized returns true

// Where to apply the middleware
export const config = {
    matcher: [
        '/api/auth/:path*',
        '/api/videos/:path*',
    ]
}