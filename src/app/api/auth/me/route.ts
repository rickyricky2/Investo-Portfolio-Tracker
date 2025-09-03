
import jwt from "jsonwebtoken";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import clientPromise from "@/lib/db";

export async function GET(){
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("login_token")?.value;

        // check for token
        if(!token){
            return NextResponse.json({
                success: false,
                loggedIn: false,
                error: "Can't find token"
            },{status: 400});
        }

        const decoded = jwt.verify(token, process.env.LOGIN_SECRET!) as {
            userId: string;
            email: string;
        };

    //     grab user data here
        const client = await clientPromise;
        const db = client.db("investodb");
        const users = db.collection('users');

        const email = decoded.email;

        const user = await users.findOne( {email:email});

        if(!user){
            return NextResponse.json({
                success:false,
                loggedIn: false,
                error: "Can't find user"
            },{status:400});
        }

        return NextResponse.json({
            success:true,
            loggedIn: true,
            user:{
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        },{status:200});

    }catch(error:unknown){
        console.error(error);
        return NextResponse.json({
            success:false,
            loggedIn: false,
            error:"Internal Server Error"
        },{status:500});
    }
}