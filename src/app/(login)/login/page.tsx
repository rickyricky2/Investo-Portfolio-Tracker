import "@/app/global.css";
import LoginForm from "@/components/loginForm";
import Header from "@/components/publicHeader";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: "Login | Investo",
    description: "Investment tracking site",
};
export default async function Login(){

    return(
        <div className={"bg-gray-100 container min-w-screen min-h-screen tracking-tight"}>
            <div className={"flex flex-col gap-10 sm:gap-40"}>
                <Header/>
                <div className={"sm:shadow-2xl sm:border-3 border-[#A882DD] rounded-lg max-w-110 h-auto m-auto font-medium"}>
                    <LoginForm/>
                </div>
            </div>
        </div>
    );
}