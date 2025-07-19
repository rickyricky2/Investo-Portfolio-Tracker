import "@/app/global.css";
import ResetPasswordForm from "@/components/resetPasswordForm";
import Header from "@/components/publicHeader"
import {Metadata} from "next";
export const metadata: Metadata = {
    title: "Password Reset | Investo",
    description: "Investment tracking site",
};

export default async function ResetPassword(){

    return(
        <div className={"bg-gray-100 container min-w-screen min-h-screen tracking-tight"}>
            <div className={"flex flex-col gap-10 sm:gap-40"}>
                <Header/>
                <div className={"sm:shadow-2xl sm:border-3 border-[#A882DD] rounded-lg max-w-160 h-auto m-auto font-medium"}>
                    <div className={"text-2xl my-5 p-5 "}>
                        <ResetPasswordForm/>
                    </div>
                </div>
            </div>
        </div>
    );
}