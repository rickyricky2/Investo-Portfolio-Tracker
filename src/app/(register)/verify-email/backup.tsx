
import "@/app/global.css";
import {useSearchParams} from "next/navigation";
import { useEffect, useState} from "react";

export default function VerifyEmailPage(){

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState({type:"loading", message:""});
    const [email, setEmail] = useState("");
    const [resendStatus, setResendStatus] = useState({type:"loading", message:""});

    useEffect( () => {
        const verify = async () =>{
            if(!token){
                setStatus({type:"error",message:"Invalid token"});
                return;
            }

            try{
                const res = await fetch("/api/verify-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body:JSON.stringify({token}),
                });

                const data = await res.json();

                if(!res.ok){
                    setStatus({type:"error",message:data.error});
                    setEmail(data.email);
                } else{
                    setStatus({type:"success",message:"Verified email successfully"});
                }
            }catch(error:any){
                setStatus({type:"error",message:error.message});
            }
        };

        verify();
    }, []);

    async function resendVerification(email:string){
        if(!email){
            setResendStatus({type:"error",message:"Invalid email"});
            return;
        }

        try{

            const res = await fetch("/api/resend-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            });

            if(!res.ok) {
                setResendStatus({type: "error", message: ""});
                return;
            }

            const data = await res.json();

            if(!data){
                setResendStatus({type:"error",message:data.error});
            }else{
                setStatus({type:"success",message:data.message});
            }

        }catch(error:any){
            console.error(error.message);
            setResendStatus({type:"error",message:error.message});
        }


    }

    return(
        <div className={"container text-3xl bg-gray-100 min-h-screen min-w-screen flex justify-center items-center tracking-tight"}>
            {status.type === "success" && (
                <div>
                    <h1 className={"text-4xl md:text-7xl"}>Thanks for verifying your email.</h1>
                    <p className={"my-3"}>Now u can go to login page to sign up.</p>
                </div>
            )}
            {status.type === "error" && (
                <p>{status.message}</p>
            )}
            {status.message === "Token is expired" && (
                <button disabled={resendStatus.type === "loading"} onClick={ () => resendVerification(email)}> Click here </button>
            )}
            {resendStatus.type === "success" && (
                <p className={"my-2"}>New verification link has been sent</p>
            )}
        </div>
    );
}