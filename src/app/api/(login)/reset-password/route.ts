import {NextResponse} from "next/server";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import clientPromise from "@/lib/db";

const sendVerificationEmail = async  (to: string,token:string) => {
//     transport config
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `"Investo Team" <${process.env.SMTP_USERNAME}>`,
        to,
        subject: "Reset your password",
        text: "",
        html: `<h1>We received a request to reset your password</h1>
                <p>Click the button below to choose a new password:</p>
                <a href="https://investo-lit9.vercel.app/restore-account?token=${token}" style="background:#4CAF50; color:white; padding:10px 20px; border-radius:4px; text-decoration:none;">Reset Password</a>
                <p>If you did not request a password reset, you can ignore this email.</p>
                <p>The Investo Team</p>`
    });
}

export async function POST(request:Request){
    try{
        const {email} = await request.json();

        const restorePasswordToken = jwt.sign(
            {email: email},
            process.env.PASSWORD_RESET_SECRET!,
            {expiresIn: "1d"}
        );

        const client = await clientPromise;
        const db = client.db("investodb");
        const users = db.collection('users');

        const user = await users.findOne(
            {email: email},
        );
        if(!user){
            return NextResponse.json({success:false, error:"Email don't match any user"},{status:400});
        }

        await sendVerificationEmail(email, restorePasswordToken);

        return NextResponse.json({success: true, message: "Link for restoring your settings has been sent"}, {status: 200});
    } catch(error:unknown){
        console.error(error);
        return NextResponse.json({success:false, error:"Some error occurred"},{status:500});
    }
}
