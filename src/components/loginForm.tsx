"use client"
import Link from "next/link";
import LoginEmail from "@/components/loginEmail";
import LoginPassword from "@/components/loginPassword";
import {useState,useRef} from "react";
import {useRouter} from "next/navigation";
import {loginFormData, ActionResponse} from "@/types/login";

export default function LoginForm(){
    const passwordRef = useRef<HTMLInputElement>(null);
    const [errors,setErrors] = useState<Partial<Record< keyof loginFormData, string[]>>>( {} );
    const [isLoading, setIsLoading] = useState(false);
    const [inputsData, setInputsData] = useState<Partial<ActionResponse>>( {
        inputs: {
            email: "",
            rememberMe: "off"
        }
    } );
    const router = useRouter();


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setIsLoading(true);

        function clearPassword(){
            if(passwordRef.current){
                passwordRef.current.value = "";
            }
        }

        const formData = new FormData(e.currentTarget);

        const rawData: loginFormData = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            rememberMe: formData.get("rememberMe") as string,
        };

        try {
            const res = await fetch("api/login", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(rawData),
            });

            const data = await res.json();

            // do zmiany
            setInputsData( {inputs: data.inputs} );
            setIsLoading(false);

            if(!data.success){
                setErrors(data.errors);
                clearPassword();
            }else{
                router.push("/dashboard");
            }
        }catch(error:any){
            setIsLoading(false);
            setErrors({email:["Couldn't log in, try again later."]});
        }
    }

    return(
        <form onSubmit={handleSubmit} >
            <div className={"text-3xl p-5 w-full flex flex-col"}>
                <LoginEmail email={inputsData.inputs?.email || "" }/>
                <LoginPassword ref={passwordRef} name={"Password"} id={"password"} required={false}/>
                <div className={"font-normal text-2xl"}>
                    <div className={"my-2 flex items-center"}>
                        <label>Remember Me</label>
                        <input type={"checkbox"}
                               className={"mx-2 mt-1 w-5 h-5"}
                               name={"rememberMe"}
                               defaultChecked={inputsData.inputs?.rememberMe === "on"}/>
                    </div>
                    <Link href={"/reset-password"} className={"hover:text-[#36314d] transition-all hover:translate-x-5 inline-block"}>Forgot password?</Link>
                </div>
                { (errors?.email || errors?.password) && (
                    <p className={"my-3 text-xl text-red-600 rounded-lg p-1 font-normal"}>
                        {errors.email || errors.password}
                    </p>
                )}
                <button type={"submit"}
                        disabled={isLoading}
                       className={" px-5 py-4 mt-3 m-auto bg-[#A882DD] active:bg-[#4a426ec9] text-gray-100 rounded-lg transition hover:-translate-y-2 hover:shadow-2xl"}>
                    { isLoading ? "Logging in.." : "Login"}
                </button>
            </div>
        </form>
    );
}