import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const isHtmlRequest = req.headers.get('accept')?.includes('text/html');

    if(!isHtmlRequest) {
        return NextResponse.next();
    }

    const token = req.cookies.get('login_token')?.value;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const publicPaths = ['/','/login','/reset-password','/restore-account', '/create-account','/product','/verify-email','/verify-notice'];
    const url = req.nextUrl.clone();

    let isAuthenticated = false;
    let userId;

    if (token) {
        try {
            const res = await fetch(`${baseURL}/api/auth/validate`,{
                method: 'GET',
                headers: { Authorization: `Bearer ${token}`},
            });
            const data = await res.json();

            if(data && data.loggedIn){
                isAuthenticated = true;
                userId = data.userId;
            }
            else if(!data.loggedIn){
                const res = NextResponse.redirect(new URL('/login', req.url));
                res.cookies.delete('login_token');
                return res;
            }
        } catch (e) {
            console.error("Middleware fetch error:", e);
            isAuthenticated = false;
        }
    }
    const res = NextResponse.next();

    if(url.pathname.match(/^\/\d+/)){
        res.headers.set("X-Robots-Tag", "noindex, nofollow");
        res.headers.set("Cache-Control", "private, max-age=0, must-revalidate");
    }

    if(publicPaths.includes(url.pathname)){
        res.headers.set(
            "Cache-Control",
            "private, max-age=0, must-revalidate"
        );
    }

    if (isAuthenticated && publicPaths.includes(url.pathname)) {
        url.pathname = `/${userId}`
        return NextResponse.redirect(url);
    }

    if (!isAuthenticated && url.pathname.match(/^\/\d+/)) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return res;
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/reset-password',
        '/restore-account',
        '/create-account',
        '/product',
        '/verify-email',
        '/verify-notice',
        '/((?!api|_next|favicon.ico).*)',
    ],
}