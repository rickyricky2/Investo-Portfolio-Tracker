
import {z} from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import {loginFormData} from "@/types/login";
import clientPromise from "@/lib/db";

// validation schema
const loginDataSchema = z.object({
    email: z.string().email("Incorrect email format, try example@email.com").min(1, "Enter your email address"),
    password: z.string().min(1,"Password is required")
        .min(8,"Incorrect email or password")
        .regex(/[a-z]/, "Incorrect email or password")
        .regex(/[A-Z]/, "Incorrect email or password")
        .regex(/\d/, "Incorrect email or password")
        .regex(/[^a-zA-Z0-9]/, "Incorrect email or password"),
    rememberMe: z.string().optional()
});

export async function POST(request: Request){
    try{
        // saving user data from form
        const json = await request.json();

        const rawData = {
            email: String(json.email),
            password: String(json.password),
            rememberMe: String(json.rememberMe),
        };

        // validation
        const validateData = loginDataSchema.safeParse(rawData);
        const { password, ...safeInputs } = rawData;

        if(!validateData.success){
            return NextResponse.json({
                success: false,
                message: "failed",
                errors: {email:validateData.error.flatten().fieldErrors.email?.[0], password:validateData.error.flatten().fieldErrors.password?.[0] },
                inputs: safeInputs,
            },{status:400});
        }

        //  checking user credentials
        const client = await clientPromise;
        const db = client.db("investodb");
        const users = db.collection('users');

        const email = rawData.email as string;
        const user = await users.findOne( { email } );

        if(!user){
            return NextResponse.json({
                success: false,
                message: "Invalid credentials",
                errors: {email:"Incorrect email or password"},
                inputs: safeInputs,
            }, { status: 400 });
        }
        // checking if user is verified/account is active
        if(!user.emailVerified){
            return NextResponse.json({
                success: false,
                message: "Account isn't activated",
                errors: {email:"Your email is not verified"},
                inputs: safeInputs,
            }, { status: 400 });
        }

        // check if password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            return NextResponse.json({
                    success: false,
                    message: "Invalid credentials",
                    errors: {password:"Incorrect email or password"},
                    inputs: safeInputs,
                }, { status: 400 });
        }

        // if yes then we do token for user
        const token = jwt.sign(
            { userId: user._id,
                email: user.email },
            process.env.LOGIN_SECRET!,
            { expiresIn: rawData.rememberMe === "on" ? "30d":"7d" }
        );

        const response = NextResponse.json({
            success: true,
            message: "Logged in",
        },{status:200});

        // setting user token in cookies for 7 days
        const tokenAge = rawData.rememberMe === "on" ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7 ;

        response.cookies.set(
            "login_token",
            token,
            {
                httpOnly: false,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: tokenAge,
            });

        return response;

    } catch(error:any){
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "An error occurred",
        },{status:500});
    }

}