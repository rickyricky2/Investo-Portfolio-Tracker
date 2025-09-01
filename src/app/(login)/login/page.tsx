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
        <div className={"text-light-text dark:text-dark-text-secondary w-full min-h-screen tracking-tight relative"}>
            <Header/>
            <div className={"w-full flex justify-center items-center h-[600px] gap-10 sm:gap-40 px-2 tiny:px-5"}>
                <div className={"shadow-2xl bg-light-bg dark:bg-dark-bg-tertiary transition rounded-4xl max-w-110 h-auto m-auto font-medium"}>
                    <LoginForm/>
                </div>
            </div>
        </div>
    );
}