"use client"
import LoginPassword from "@/components/loginPassword";
import {useState,useEffect} from "react";
import {useSearchParams} from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import {z} from "zod";
import {NextResponse} from "next/server";

// validation schema
const passwordSchema = z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

export default function RestoreAccountClient(){
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const[error, setError] = useState("");
    const[status,setStatus] = useState("loading");

    useEffect( ()=>{
        const verify_token = async () => {
            if(!token){
                setStatus("error");
                setError("Invalid token");
                return;
            }
            try {
                const res = await fetch("/api/restore-account-token", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({token}),
                })
                const data = await res.json();

                if(!data.success) {
                    setStatus("error");
                    setError(data.error);
                    return;
                }
            }catch(error:any){
                setStatus("error");
                setError(error.message);
            }
        }
        verify_token();
    },[]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const password1 = formData.get("new_password1") as string;
        const password2 = formData.get("new_password2") as string;

        const comparePasswords = (password1:string,password2:string):boolean =>{
            return password1 === password2;
        }

        if(!comparePasswords(password1,password2)){
            setError("Passwords don't match");
            return;
        }

        const validatePassword = passwordSchema.safeParse(password1);

        if(!validatePassword.success){
            setError(validatePassword.error.errors[0]?.message);
            return;
        }
        console.log(password1);
        const res = await fetch("/api/restore-account",{
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({token,password1}),
        })

        const data = await res.json();

        if(!data.success){
            setStatus("error");
            setError(data.error);
        }else{
            setStatus("success");
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className={"flex relative overflow-hidden tracking-tight"}>
                <div className={`transition duration-800 ${ status !== "loading" ? "-translate-x-180" : ""}`}>
                    <LoginPassword name={"New password"} id={"new_password1"} />
                    <LoginPassword name={"New Password Again"} id={"new_password2"} />
                    {(error && status === "loading") && (
                        <p className="text-red-500">{error}</p>
                    )}
                    <div className={"text-center"}>
                        <input
                        type={"submit"}
                        value={"Change password"}
                        disabled={!(status === "loading")}
                        className={"px-10 py-3 mt-3 m-auto bg-[#A882DD] active:bg-[#4a426ec9] text-gray-100 rounded-lg transition hover:-translate-y-2 hover:shadow-2xl"}
                        />
                    </div>
                </div>
                <div className={`absolute transition duration-800 ${ status === "success" ? "inset-5":"translate-x-180"}`}>
                    <h2 className={"text-center"}>Successfuly updated your password</h2>
                    <FaCheck className={"text-9xl m-auto my-10 text-[#A882DD]"}/>
                </div>
                <div className={`absolute transition duration-800 ${ status === "error" ? "inset-5":"translate-x-180"}`}>
                    <h2 className={"text-center"}>{error}</h2>
                    <RxCross2 className={"text-9xl m-auto my-10 text-[#A882DD]"} />
                </div>
            </div>
        </form>
    );
}