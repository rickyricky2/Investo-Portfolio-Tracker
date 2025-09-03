
import {FaRegEyeSlash, FaRegEye} from "react-icons/fa";
import { useEffect, useState } from "react";
import {useActionState} from "react";
import {ActionResponse} from "@/types/createAccount";
import  {createAccount} from "./actions";
import {useRouter} from "next/navigation";

const initialState: ActionResponse = {
    success: false,
    message: '',
};

export default function CreateAccountPage(){
    const [showPassword,setShowPassword]=useState(false);
    const [subscriptionDurationState,setSubscriptionDuration]=useState("");
    const [subscriptionTypeState,setSubscriptionType]=useState("");

    const router = useRouter();

    const [state,action,isPending] = useActionState(createAccount,initialState);

    useEffect(() => {
        try{
            const subscriptionDuration = localStorage.getItem("subscriptionDuration");
            const subscriptionType = localStorage.getItem("subscriptionType");

            if(subscriptionType && subscriptionDuration){
                setSubscriptionDuration(subscriptionDuration);
                setSubscriptionType(subscriptionType);
            } else{
                router.push("/product");
            }
        } catch(error){
            console.error("Couldn't access date in localStorage", error);
            window.location.href ="/product";
        }
    }, []);

    useEffect( () => {
        if(state.success){
            router.push("/verify-notice");
        }
    },[state.success]);

    return(
        <div className={"container tracking-tight min-h-screen min-w-screen bg-gradient-to-b from-gray-100 to-white"}>
            <div className={"flex justify-center items-center"}>
                <main className={"my-20 tracking-tight"}>
                    <h1 className={"text-6xl text-center"}>Create An Account</h1>
                    <div className={"md:w-[600] min-h-[600] my-10 border-2 border-gray-300 transition-all hover:border-[#A882DD] p-5 rounded-sm inline-block"}>
                        <form action={action}>
                            <input type={"hidden"} value={subscriptionTypeState} name={"subscriptionType"}/>
                            <input type={"hidden"} value={subscriptionDurationState} name={"subscriptionDuration"}/>
                            <article className={"my-5"}>
                                <label className={"text-3xl"}>Email</label>
                                <input
                                    type={"email"}
                                    defaultValue={state.inputs?.email}
                                    name={"email"}
                                    required
                                    minLength={2}
                                    maxLength={100}
                                    className={`mt-1 border-2 rounded-md p-1 px-2 w-full text-2xl focus:border-[#49416D] focus:border-3 ${state?.errors?.email ? "border-red-500 focus:border-red-500" : ' '}`}/>
                                {state?.errors?.email && (
                                    <p className={"text-2xl text-red-500"}>
                                        {state.errors.email[0]}
                                    </p>
                                )}
                            </article>
                            <article className={"my-5 relative"}>
                                <label  className={"text-3xl"}>Password</label>
                                <input type={showPassword ? "text" : "password"}
                                       required
                                       minLength={8}
                                       maxLength={100}
                                       name={"password"}
                                       className={`mt-1 border-2 rounded-md p-1 px-2 w-full text-2xl focus:border-[#49416D] focus:border-3 ${state?.errors?.password ? "border-red-500 focus:border-red-500" : ' '}`}/>
                                {state?.errors?.password && (
                                    <p className={"text-2xl text-red-500"}>
                                        {state.errors.password[0]}
                                    </p>
                                )}
                                <span className={"absolute top-12 right-3 text-3xl"}
                                      onClick={ () => setShowPassword( (prev) => !prev)}>
                                    {showPassword ? <FaRegEyeSlash/> : <FaRegEye/> }
                                </span>
                            </article>
                            <article className={"my-5"}>
                                <label  className={"text-3xl"}>First Name</label>
                                <input type={"text"}
                                       defaultValue={state.inputs?.firstName}
                                       name={"firstName"}
                                       required
                                       minLength={2}
                                       maxLength={50}
                                       className={`mt-1 border-2 rounded-md p-1 px-2 w-full text-2xl focus:border-[#49416D] focus:border-3 ${state?.errors?.firstName ? "border-red-500 focus:border-red-500" : ' '}`}/>
                                {state?.errors?.firstName && (
                                    <p className={"text-2xl text-red-500"}>
                                        {state.errors.firstName[0]}
                                    </p>
                                )}
                            </article>
                            <article className={"my-5"}>
                                <label  className={"text-3xl"}>Last Name</label>
                                <input  type={"text"}
                                        defaultValue={state.inputs?.lastName}
                                        name={"lastName"}
                                        required
                                        minLength={2}
                                        maxLength={50}
                                        className={`mt-1 border-2 rounded-md p-1 px-2 w-full text-2xl focus:border-[#49416D] focus:border-3 ${state?.errors?.lastName ? "border-red-500 focus:border-red-500" : ' '}`}/>
                                {state?.errors?.lastName && (
                                    <p className={"text-2xl text-red-500"}>
                                        {state.errors.lastName[0]}
                                    </p>
                                )}
                            </article>
                            <article>
                                <label className={"text-2xl"} >Accept our terms</label>
                                <input type={"checkbox"}
                                    // required
                                       name={"terms"}
                                       className={`mx-2 w-5 h-5 ${state?.errors?.terms ? "border-red-500 focus:border-red-500 " : ""}`}/>
                                {state?.errors?.terms && (
                                    <p className={"text-2xl text-red-500"}>
                                        {state.errors.terms[0]}
                                    </p>
                                )}
                            </article>
                            <article className={"mt-10 relative"}>
                                <button type={"submit"}
                                        disabled={isPending}
                                        className={"text-2xl px-5 py-4 m-auto bg-[#49416D] active:bg-[#4a426ec9] text-gray-100 rounded-lg transition hover:-translate-y-2 hover:shadow-2xl"}>
                                    {isPending ? 'Creating settings..' : 'Create Account' }</button>
                            </article>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}