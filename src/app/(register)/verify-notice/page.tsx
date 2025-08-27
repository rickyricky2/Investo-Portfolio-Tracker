import "@/app/global.css";
import PublicHeader from "@/components/publicHeader";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Investo",
    description: "Investment tracking site",
};

export default function VerifyNoticePage(){
    return (
        <div className={"w-full min-h-screen tracking-tight bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"}>
            <PublicHeader/>
            <div className={"flex justify-center items-center px-5 my-10 m-auto"}>
                <div className={"flex flex-col gap-5 sm:gap-15 md:text-5xl text-center mb-5"}>
                    <h1 className=" py-6 text-4xl sm:text-5xl  lg:text-7xl">
                        Thank you for creating an account!
                    </h1>
                    <p className="py-6 text-2xl sm:text-3xl lg:text-4xl">
                        We&apos;ve sent a verification link to your email address.<br/> Please check your inbox and click the link to verify your account.
                    </p>
                    <p className="py-6 text-xl sm:text-2xl lg:text-3xl">
                        Didn&apos;t get the email? Make sure to check your spam folder or click the button below to resend the verification link.
                    </p>
                </div>
            </div>
        </div>
    );
}