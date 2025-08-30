"use client"
import "@/app/global.css";
import LoginEmail from "@/components/loginEmail"
import {useState}  from "react";
import {FaCheck, FaSpinner} from "react-icons/fa";

export default function ResetPasswordForm() {
    const [isSend,setIsSend] =  useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError]=useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const baseURL = process.env.PUBLIC_BASE_URL || "http://localhost:3000";

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');

        try {
            const res = await fetch(`${baseURL}/api/reset-password`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email})
            });

            const data = await res.json();

            setIsLoading(false);

            if(!data.success){
                setIsSend(false);
                setError(data.error);
            }else{
                setIsSend(true);
            }

        }catch(error:unknown){
            console.error(error);
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className={"flex relative overflow-hidden tracking-tight"}>
                <div className={`transition duration-800 ${ isSend ? "-translate-x-180" : ""}`}>
                    <h2 className={"text-center text-3xl pb-5"}>Forgot your password?</h2>
                    <p className={"text-center my-2 text-xl lg:text-2xl"}>Enter the email address associated with your account and we’ll send you a link to reset your password.</p>
                    <LoginEmail email={""} isError={!!error}/>
                    {error && (
                        <p className={" text-light-error-text dark:text-dark-error-text"}>{error}</p>
                    )}
                    <div className={"text-center"}>
                        <button type={"submit"}
                               disabled={isSend}
                               className={"px-10 py-3 mt-4 m-auto bg-light-secondary dark:bg-dark-secondary active:bg-light-active dark:active:bg-dark-active text-light-text-secondary dark:text-dark-text rounded-lg transition hover:-translate-y-2 hover:shadow-2xl"}>
                            {isLoading ? <FaSpinner size={30} className={"animate-spin mx-auto"} /> : "Login"}
                        </button>
                    </div>
                </div>
                <div className={`absolute transition duration-800 ${ isSend ? "inset-5":"translate-x-180"}`}>
                    <h2 className={"text-center text-2xl lg:text-4xl"}>Link to reset your passsword has been sent</h2>
                    <FaCheck className={"text-9xl m-auto my-10 text-light-main dark:text-dark-main"} />
                </div>
            </div>
        </form>
    );
}