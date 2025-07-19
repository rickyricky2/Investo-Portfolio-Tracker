import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('login_token')?.value;

    const pathName = request.nextUrl.pathname;
    const publicPaths = ['/','/login','/create-account','/product','/verify-email','/verify-notice']
    const isPublicPath = publicPaths.includes(pathName);

    let isLoggedIn = false;

    if(token){
        try {
            const res = await fetch(`${request.nextUrl.origin}/api/auth/validate`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            isLoggedIn = data.loggedIn;

        } catch (err:any) {
            console.error("Error: ",err);
            isLoggedIn = false;
        }
    }

    if (!isLoggedIn && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isLoggedIn && isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();


}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/create-account', '/product', '/verify-email', '/verify-notice' , '/'],

};