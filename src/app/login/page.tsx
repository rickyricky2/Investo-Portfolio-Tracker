import Link from "next/link";
import "../global.css";
import LoginForm from "./loginForm";

export default async function Login(){

    return(
        <div className={"bg-gray-100 container min-w-screen min-h-screen tracking-tight flex"}>
            <div className={"shadow-2xl border-3 border-[#49416D] rounded-lg max-w-110 h-auto m-auto font-medium"}>
                <LoginForm/>
            </div>
        </div>
    );
}