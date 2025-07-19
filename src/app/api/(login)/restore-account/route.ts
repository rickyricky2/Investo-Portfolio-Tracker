
import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/db";
import nodemailer from "nodemailer";

const sendEmail = async  (to: string) => {
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

    const mail = await transporter.sendMail({
        from: `"Investo Team" <${process.env.SMTP_USERNAME}>`,
        to,
        subject: "Password Change",
        text: "",
        html: `<h1>You have successfully changed your password!</h1>
                <p>This is a confirmation that your password was successfully changed for your Investo account.</p>
                <p>If you made this change, no further action is needed</p>
                <p>If you didn’t change your password, please reset it immediately or contact support.</p>
                <p>The Investo Team</p>`
    });
    console.log("message sent: ", mail.messageId);
}

export async function POST(req:Request) {
    const {token,password1} = await req.json();
    console.log(token, password1);

    if(!token || !password1) {
        return NextResponse.json({success:false,error:"Internal Error Occurred"},{status: 500});
    }

    try{
        const passwordHash = await bcrypt.hash(password1, 10);
        let payload;
        try{
            payload = jwt.verify(token, process.env.PASSWORD_RESET_SECRET!);
            if(!(typeof payload === "object" && "email" in payload)){
                throw new Error('Invalid token');
            }
        }catch{
            return NextResponse.json({success:false,error:"Invalid or expired token"},{status:400});
        }

        const email = payload.email;

        const client = await clientPromise;
        const db = client.db("investodb");
        const users = db.collection('users');

        const userData = await users.findOne( {email:email} );

        if(!userData){
            return NextResponse.json({success:false,error:"Invalid token"},{status:400});
        }

        await users.updateOne(
            { email: email },
            {
                $set: { password: passwordHash},
            }
        );

        await sendEmail(email);

        return NextResponse.json({success:true},{status:200});

    }catch(error:any){
        return NextResponse.json({success:false,error:error},{status:500});
    }
}