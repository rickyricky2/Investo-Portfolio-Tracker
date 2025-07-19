"use client"
import "@/app/global.css";
import LoginEmail from "@/components/loginEmail"
import {useRouter} from "next/navigation";
import {useState}  from "react";
import { FaCheck } from "react-icons/fa";

export default function ResetPasswordForm() {
    const router = useRouter();
    const [isSend,setIsSend] =  useState(false);
    const [error,setError]=useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email})
            });

            const data = await res.json();

            if(!data.success){
                setIsSend(false);
                setError(data.error);
            }else{
                setIsSend(true);
            }

        }catch(error:any){
            console.error(error);
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className={"flex relative overflow-hidden tracking-tight"}>
                <div className={`transition duration-800 ${ isSend ? "-translate-x-180" : ""}`}>
                    <h2 className={"text-center text-3xl pb-5"}>Forgot your password?</h2>
                    <p className={"text-center"}>Enter the email address associated with your account and we’ll send you a link to reset your password.</p>
                    <LoginEmail email={""}/>
                    {error && (
                        <p className={"pl-5 text-red-500"}>{error}</p>
                    )}
                    <div className={"text-center"}>
                        <input type={"submit"}
                               disabled={isSend}
                               value={"Send"}
                               className={"px-10 py-3 mt-3 m-auto bg-[#A882DD] active:bg-[#4a426ec9] text-gray-100 rounded-lg transition hover:-translate-y-2 hover:shadow-2xl"}/>
                    </div>
                </div>
                <div className={`absolute transition duration-800 ${ isSend ? "inset-5":"translate-x-180"}`}>
                    <h2 className={"text-center"}>Link to reset your passsword has been sent</h2>
                    <FaCheck className={"text-9xl m-auto my-10 text-[#A882DD]"}/>
                </div>
            </div>
        </form>
    );
}