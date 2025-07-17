import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('login_token')?.value;

    const isLoggedIn = (() => {
        if (!token) return false;
        try {
            jwt.verify(token, process.env.LOGIN_SECRET!);
            return true;
        } catch {
            return false;
        }
    })();

    const pathname = request.nextUrl.pathname;

    const isPublicPath = pathname === '/login' || pathname === '/register' || pathname.startsWith('/public');

    if (!isLoggedIn && !isPublicPath) {
        // user nie zalogowany, a próbuje wejść na chronioną stronę -> redirect do /login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isLoggedIn && isPublicPath) {
        // user zalogowany, a próbuje wejść na publiczną stronę logowania/rejestracji -> redirect do /dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // wszystko OK, pozwól przejść
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register', '/public/:path*'],
};