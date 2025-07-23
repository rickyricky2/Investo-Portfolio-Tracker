
import jwt from "jsonwebtoken";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import clientPromise from "@/lib/db";

export async function GET(req:Request){
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("login_token")?.value;

        // check for token
        if(!token){
            return NextResponse.json({
                loggedIn: false
            },{status: 400});
        }

        const decoded = jwt.verify(token, process.env.LOGIN_SECRET!) as {
            userId: string;
            email: string;
        };

    //     grab user data here
        const client = await clientPromise;
        const db = client.db("users");
        const users = db.collection("users");

        const user  =  await users.findOne({
            email: decoded.email
        });

        console.log(1);

        if(!user){
            return NextResponse.json({
                loggedIn: false,
                message: "Can't find user"
            },{status:400});
        }

        return NextResponse.json({
            loggedIn: true,
            user:{
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lasttName,
            }
        },{status:200});

    }catch(error:any){
        console.error(error.message);
        return NextResponse.json({
            loggedIn: false,
        },{status:500});
    }
}