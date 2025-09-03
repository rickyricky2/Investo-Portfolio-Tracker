
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json({ loggedIn: false }, { status: 401 });
    }
    try {
        const decoded = jwt.verify(token, process.env.LOGIN_SECRET!) as {
            userId: string;
            email: string;
        };
        return NextResponse.json({ loggedIn: true, userId:decoded.userId},{ status: 200 });
    } catch (error:unknown) {
        return NextResponse.json({ loggedIn: false, error:error }, { status: 401 });
    }
}