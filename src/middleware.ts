import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('login_token')?.value;

    const pathName = request.nextUrl.pathname;
    const publicPaths = ['/','/login','/reset-password','/restore-settings','/create-settings','/product','/verify-email','/verify-notice']
    const isPublicPath = publicPaths.includes(pathName);

    let isLoggedIn = false;
    let userId;

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
            userId = data.userId;

        } catch (err:any) {
            console.error("Error: ",err);
            isLoggedIn = false;
        }
    }

    if (!isLoggedIn && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isLoggedIn && isPublicPath) {
        return NextResponse.redirect(new URL(`/${userId}`, request.url));
    }

    return NextResponse.next();


}

export const config = {
    matcher: ['/:user((?!api|_next|favicon.ico)[^/]+)','/:user((?!api|_next|favicon.ico)[^/]+)/:path*', '/login', '/create-settings', '/product', '/verify-email', '/verify-notice' , '/'],

};