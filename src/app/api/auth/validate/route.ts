
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json({ loggedIn: false }, { status: 401 });
    }

    try {
        jwt.verify(token, process.env.LOGIN_SECRET!);
        return NextResponse.json({ loggedIn: true},{ status: 200 });
    } catch (err) {
        return NextResponse.json({ loggedIn: false }, { status: 401 });
    }
}