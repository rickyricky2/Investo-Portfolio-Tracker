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
        <div className={"text-light-text dark:text-dark-text w-full min-h-screen tracking-tight"}>
            <div className={"w-full flex flex-col gap-10 sm:gap-40 "}>
                <Header/>
                <div className={"shadow-2xl bg-light-bg-secondary dark:bg-dark-bg-tertiary transition rounded-3xl max-w-110 h-auto m-auto font-medium"}>
                    <LoginForm/>
                </div>
            </div>
        </div>
    );
}