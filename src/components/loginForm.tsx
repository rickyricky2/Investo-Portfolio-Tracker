"use client"
import Link from "next/link";
import LoginEmail from "@/components/loginEmail";
import LoginPassword from "@/components/loginPassword";
import {useState,useRef} from "react";
import {useRouter} from "next/navigation";
import {loginFormData, ActionResponse} from "@/types/login";
import {FaSpinner} from "react-icons/fa";

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
    const [isChecked,setIsChecked] = useState(false);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setIsLoading(true);

        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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
            const res = await fetch(`${baseURL}/api/login`, {
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
                router.refresh();
            }
        }catch{
            setIsLoading(false);
            setErrors({email:["Couldn't log in, try again later."]});
        }
    }

    return(
        <form onSubmit={handleSubmit} >
            <div className={"text-3xl p-5 w-full flex flex-col"}>
                <LoginEmail email={inputsData.inputs?.email || "" } isError={!!errors?.email}/>
                <LoginPassword ref={passwordRef} name={"Password"} id={"password"} required={false}
                               isError={!!errors?.password}/>
                <div className={"font-normal text-2xl"}>
                    <div className={"my-2 flex items-center relative"}>
                        <label>Remember Me</label>
                        <input type={"checkbox"}
                            // required
                               name={"terms"}
                               onChange={() => setIsChecked(!isChecked)}
                               className={`absolute left-[160px] top-[8px] border-2 appearance-none w-5 h-5 dark:focus:border-dark-secondary ${isChecked ? "border-light-main dark:border-dark-main" : "border-light-secondary dark:border-dark-text"} `}/>
                        <div className={`absolute left-[162px] top-[18px] ${isChecked ? "" : "hidden"}`}>
                            <span className={`bg-light-text dark:bg-dark-text w-[10px] h-[2px] rounded-full absolute transition rotate-45`}></span>
                            <span className={`bg-light-text dark:bg-dark-text w-[10px] h-[2px] rounded-full absolute transition translate-x-[60%] rotate-135`}></span>
                        </div>
                    </div>
                    <Link href={"/reset-password"} className={"hover:text-light-main dark:hover:text-dark-main active:text-light-active dark:active:text-dark-active transition-all hover:translate-x-5 inline-block"}>Forgot password?</Link>
                </div>
                { (errors?.email || errors?.password) && (
                    <p className={"my-3 text-xl text-light-error-text dark:text-dark-error-text rounded-lg p-1 font-medium"}>
                        {errors.email || errors.password}
                    </p>
                )}
                <button type={"submit"}
                        disabled={isLoading}
                       className={"cursor-pointer px-5 py-4 mt-3 m-auto bg-light-secondary dark:bg-dark-secondary text-light-text-secondary dark:text-dark-text active:bg-light-active dark:active:bg-dark-active rounded-lg transition hover:-translate-y-2 hover:shadow-2xl"}>
                    { isLoading ? <FaSpinner size={30} className={"animate-spin mx-auto"} /> : "Login"}
                </button>
            </div>
        </form>
    );
}