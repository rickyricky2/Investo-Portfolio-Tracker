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
        <div className={"bg-light-bg dark:bg-dark-bg w-full text-light-text dark:text-dark-text min-h-screen tracking-tight"}>
            <div className={"flex flex-col gap-10 sm:gap-40"}>
                <PublicHeader/>
                <div className={"sm:shadow-2xl sm:border-3 border-gray-400 dark:border-dark-text-secondary hover:border-light-main dark:hover:border-dark-main rounded-lg max-w-160 h-auto m-auto font-medium"}>
                    <div className={"text-2xl my-5 p-5 "}>
                        <ResetPasswordForm/>
                    </div>
                </div>
            </div>
        </div>
    );
}