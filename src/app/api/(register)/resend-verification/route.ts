
import {NextResponse} from "next/server";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import clientPromise from "@/lib/db";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const sendVerificationEmail = async  (to: string,token:string) => {
//     transport config
    const transporter = nodemailer.createTransport({
        host: "server423682.nazwa.pl",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `"Investo Team" <${process.env.SMTP_USERNAME}>`,
        to,
        subject: "New verification link",
        text: "",
        html: `<h1>Your new verification link is here!</h1>
                <p>Click on link below to verify your investo account</p>
                <a href="${baseURL}/verify-email?token=${token}" style="background:#4CAF50; color:white; padding:10px 20px; border-radius:4px; text-decoration:none;">Verify here</a>`
    });
}

export async function POST(request:Request){
    try{
        const {email} = await request.json();

        const emailToken = jwt.sign(
            {email: email},
            process.env.EMAIL_VERIFICATION_SECRET!,
            {expiresIn: "1d"}
        );

        const client = await clientPromise;
        const db = client.db("investodb");
        const users = db.collection('users');

        await users.updateOne(
            {email: email},
            {
                $set: {emailVerificationToken: emailToken},
            }
        );

        await sendVerificationEmail(email, emailToken);

        return NextResponse.json({success: true, message: "New verification email has been sent"}, {status: 200});
    } catch(error:unknown){
        return NextResponse.json({error:error},{status:500});
    }
}
