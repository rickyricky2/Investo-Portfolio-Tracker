import "@/app/global.css";
import ResetPasswordForm from "@/components/resetPasswordForm";
import PublicHeader from "@/components/publicHeader";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: "Password Reset | Investo",
    description: "Investment tracking site",
};

export default async function ResetPassword(){

    return(
        <div className={"w-full text-light-text dark:text-dark-text min-h-screen tracking-tight"}>
            <PublicHeader/>
            <div className={"flex justify-center items-center h-[600px] sm:h-[800px] px-2 tiny:px-5"}>
                <div className={"bg-light-bg-secondary dark:bg-dark-bg-tertiary shadow-2xl rounded-lg max-w-160 h-auto m-auto font-medium"}>
                    <div className={"text-2xl my-5 p-5 "}>
                        <ResetPasswordForm/>
                    </div>
                </div>
            </div>
        </div>
    );
}