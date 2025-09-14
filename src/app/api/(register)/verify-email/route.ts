
import {NextResponse} from "next/server";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import clientPromise from "@/lib/db";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const sendConfirmationEmail = async  (to: string) => {
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
        subject: "Your email has been confirmed",
        text: "",
        html: `<h1>Thanks for confirming your email!</h1>
                <p>Now u can enjoy our app. Log in from link below.</p>
                <a href="${baseURL}/login" style="background:#4CAF50; color:white; padding:10px 20px; border-radius:4px; text-decoration:none;">Log in here</a>`
    });
}


export async function POST(request: Request){
    const { token } = await request.json();

    if(!token){
        return NextResponse.json({error:"Missing token "},{status: 400});
    }

    try{
        //  checking if token is expired / returns error if yes
        const payload = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET!);

        if(!(typeof payload === "object" && "email" in payload)){
            throw new Error('Invalid token');
        }
        const email = payload.email;

        const client = await clientPromise;
        const db = client.db("investodb");
        const users = db.collection('users');

        const userData = await users.findOne({
            emailVerificationToken: token,
        });

        if(!userData){
            return NextResponse.json({error: "Invalid token", email:email}, {status: 400});
        }


        await users.updateOne(
            { emailVerificationToken: token },
            {
                $set: { emailVerified: true},
                $unset: { emailVerificationToken: "" }
            }
        );

        // sending a confirmation email to our user
        await sendConfirmationEmail(email);

        return NextResponse.json({success:true},{status:200});

    }catch(error:unknown){
        if( error instanceof Error && error.name === "TokenExpiredError"){

            const client = await clientPromise;
            const db = client.db("investodb");
            const users = db.collection('users');

            const userData = await users.findOne({
                emailVerificationToken: token,
            });

            if(!userData){
                return NextResponse.json({error:`Token expired but couldn't get user email`, code:"TOKEN_EXPIRED"}, {status:400});
            }

            return NextResponse.json({error:`Token is expired`, code:"TOKEN_EXPIRED", email: userData!.email}, {status:400});
        }
        console.error("An error occurred when verifying email",error);
        return NextResponse.json({error:"Internal server error"},{status:500});
    }


}
