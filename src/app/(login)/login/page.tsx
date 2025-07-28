import "@/app/global.css";
import LoginForm from "@/components/loginForm";
import Header from "@/components/publicHeader";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: "Login | Investo",
    description: "Investment tracking site",
};
export default function Login(){

    return(
        <div className={"bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text w-full min-h-screen tracking-tight"}>
            <div className={"flex flex-col gap-10 sm:gap-40"}>
                <Header/>
                <div className={"sm:shadow-2xl transition sm:border-3 border-gray-400 dark:border-dark-text-secondary hover:border-light-main dark:hover:border-dark-main rounded-lg max-w-110 h-auto m-auto font-medium"}>
                    <LoginForm/>
                </div>
            </div>
        </div>
    );
}