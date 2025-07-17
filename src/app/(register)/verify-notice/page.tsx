import "@/app/global.css";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: "Investo - Verified!",
    description: "Investment tracking site",
};

export default function VerifyNoticePage(){
    return (
        <div className={"container min-h-screen min-w-screen tracking-tight bg-gray-100"}>
            <div className={"flex justify-center items-center p-20 px-50"}>
                <div className={"text-4xl md:text-5xl text-center mb-5"}>
                    <h1 className=" text-gray-700 py-6 lg:text-7xl">
                        Thank you for creating an account!
                    </h1>
                    <p className="text-gray-700 py-6">
                        We've sent a verification link to your email address.<br/> Please check your inbox and click the link to verify your account.
                    </p>
                    <p className="text-gray-600 py-6 text-4xl">
                        Didn’t get the email? Make sure to check your spam folder or click the button below to resend the verification link.
                    </p>
                </div>
            </div>
        </div>
    );
}