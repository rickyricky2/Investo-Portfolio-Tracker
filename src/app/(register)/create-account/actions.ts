"use server";

import z from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import clientPromise from "@/lib/db";
import {ActionResponse, CreateAccountFormData} from "@/types/createAccount";

//  function for sending and welcome email
const sendWelcomeEmail = async  (to: string, emailToken:string) => {
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
        subject: "Welcome to investo",
        text: "Thanks for trusting us!!",
        html: `<h1>Welcome to Investo!</h1>
                <p>Thank you for registering. To activate your account, please confirm your email address by clicking the button below:</p>
                <a href="http://localhost:3000/verify-email?token=${emailToken}" style="background:#4CAF50; color:white; padding:10px 20px; border-radius:4px; text-decoration:none;">Confirm your email</a>
                <p>If you didn’t create this account, you can ignore this email.</p>`,
    });
    console.log("message sent: ", mail.messageId);
}

// schemat do walidacji
const createAccountSchema = z.object({
    email: z.string().email("Incorrect email format, try example@email.com"),
    password: z.string().min(8,"Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    terms: z.literal("on", {
        errorMap: () => ({message:"You must accept the terms to create an account"})
    }),
});

export async function createAccount(
    prevState: ActionResponse | null,
    formData: FormData
): Promise<ActionResponse> {

    try{
        const rawData: CreateAccountFormData = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            firstName:formData.get('firstName') as string,
            lastName:formData.get('lastName') as string,
            terms:formData.get("terms") as string,
        };
        const subscriptionType = formData.get('subscriptionType') as string;
        const subscriptionDuration = formData.get('subscriptionDuration') as string;

        const validateData = createAccountSchema.safeParse(rawData);
        const {password,terms, ...safeInputs} = rawData;

        if(!validateData.success){
            return {
                success:false,
                message: "Please fix the errors in the forms",
                errors: validateData.error.flatten().fieldErrors,
                inputs: safeInputs,
            };
        }

        const client = await clientPromise;
        const db = client.db("investodb");
        const users = db.collection('users');

        await users.createIndex({ email:1 }, { unique:true });

        // check if email been used
        const existingUser = await users.findOne({
            email: rawData.email
        });

        if(existingUser){
            return {
                success:false,
                message: "Email already in use",
                errors: {email: ["Email already in use"]},
                inputs: safeInputs,
            };
        }

        const hashedPassword = await bcrypt.hash(rawData.password,10);

        // creating an email verification token
        const emailToken = jwt.sign(
            { email: rawData.email},
            process.env.EMAIL_VERIFICATION_SECRET!,
            {expiresIn: "1d"}
        );


        // saving user to db
        await users.insertOne({
            email: rawData.email,
            password: hashedPassword,
            firstName: rawData.firstName,
            lastName: rawData.lastName,
            admin: false,
            emailVerified: false,
            emailVerificationToken: emailToken,
            subscription: {
                plan: subscriptionType,
                type: subscriptionDuration,
                active: true,
                refresh: true,
                startedAt: new Date(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * (subscriptionDuration === "monthly" ? 30 : 365 )),
            },
            createdAt: new Date(),
        });
        // checking if account was created
        const user = await users.findOne({email:rawData.email});
        if(!user){
            return{
                success:false,
                message: "User was not created",
            }
        }

        // sending an email with verification link to our new user
        await sendWelcomeEmail(rawData.email,emailToken);

        return {
            success: true,
            message: "Created account",
        };
    } catch(error){
        console.error("An error occurred ",error);
        return{
            success: false,
            message: 'An unexpected error occurred',
        }
    }
}