"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { ActionResponse } from "@/types/createAccount";
import { createAccount } from "@/app/(register)/create-account/actions";

const initialState: ActionResponse = {
    success: false,
    message: "",
};

export default function CreateAccountForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [subscriptionDurationState, setSubscriptionDuration] = useState("");
    const [subscriptionTypeState, setSubscriptionType] = useState("");
    const router = useRouter();
    const [state, action, isPending] = useActionState(createAccount, initialState);
    const [isChecked,setIsChecked] = useState(false);

    useEffect(() => {
        try {
            const subscriptionDuration = localStorage.getItem("subscriptionDuration");
            const subscriptionType = localStorage.getItem("subscriptionType");

            if (subscriptionType && subscriptionDuration) {
                setSubscriptionDuration(subscriptionDuration);
                setSubscriptionType(subscriptionType);
            } else {
                router.push("/product");
            }
        } catch (error) {
            console.error("Couldn't access data in localStorage", error);
            router.push("/product");
        }
    }, []);

    useEffect(() => {
        if (state.success) {
            router.push("/verify-notice");
        }
    }, [state.success]);

    return (
        <div className="md:w-[600] min-h-[600] sm:my-10 bg-light-bg dark:bg-dark-bg-tertiary transition-all p-5 rounded-[50px] inline-block shadow-2xl sm:px-20">
            <form action={action}>
                <input type="hidden" value={subscriptionTypeState} name="subscriptionType" />
                <input type="hidden" value={subscriptionDurationState} name="subscriptionDuration" />

                <article className={"my-5"}>
                    <label className={`text-3xl ${state?.errors?.email ? "text-light-error-text dark:text-dark-error-text" : 'text-light-text dark:text-dark-text-secondary'}`}>Email</label>
                    <input
                        type={"email"}
                        defaultValue={state.inputs?.email}
                        name={"email"}
                        required
                        minLength={2}
                        maxLength={100}
                        className={`mt-1 border-2 dark:border-dark-text-secondary rounded-xl p-1 px-2 transition outline-none w-full text-2xl focus:border-3 ${state?.errors?.email ? "border-light-error-border focus:border-light-error-border bg-light-error-bg text-light-error-text dark:text-dark-error-text dark:bg-dark-error-bg dark:border-dark-error dark:focus:border-dark-error" : 'focus:border-light-secondary dark:focus:border-dark-secondary '}`}/>
                    {state?.errors?.email && (
                        <p className={"text-2xl text-light-error-text dark:text-dark-error-text"}>
                            {state.errors.email[0]}
                        </p>
                    )}
                </article>
                <article className={"my-5 relative"}>
                    <label  className={`text-3xl ${state?.errors?.password ? "text-light-error-text dark:text-dark-error-text" : 'text-light-text dark:text-dark-text-secondary'}`}>Password</label>
                    <input type={showPassword ? "text" : "password"}
                           required
                           minLength={8}
                           maxLength={100}
                           name={"password"}
                           className={`mt-1 border-2 dark:border-dark-text-secondary rounded-xl p-1 px-2 transition outline-none w-full text-2xl  focus:border-3 ${state?.errors?.password ? "border-light-error-border focus:border-light-error-border bg-light-error-bg text-light-error-text dark:text-dark-error-text dark:bg-dark-error-bg dark:border-dark-error dark:focus:border-dark-error" : 'focus:border-light-secondary dark:focus:border-dark-secondary '}`}/>
                    {state?.errors?.password && (
                        <p className={"text-2xl text-light-error-text dark:text-dark-error-text"}>
                            {state.errors.password[0]}
                        </p>
                    )}
                    <span className={`absolute top-12 right-3 text-3xl ${state?.errors?.password ? "text-light-error-text dark:text-dark-error-text" : 'text-light-text dark:text-dark-text-secondary' }`}
                          onClick={ () => setShowPassword( (prev) => !prev)}>
                                    {showPassword ? <FaRegEyeSlash/> : <FaRegEye/> }
                                </span>
                </article>
                <article className={"my-5"}>
                    <label  className={`text-3xl ${state?.errors?.firstName ? "text-light-error-text dark:text-dark-error-text" : 'text-light-text dark:text-dark-text-secondary'}`}>First Name</label>
                    <input type={"text"}
                           defaultValue={state.inputs?.firstName}
                           name={"firstName"}
                           required
                           minLength={2}
                           maxLength={50}
                           className={`mt-1 border-2 dark:border-dark-text-secondary rounded-xl p-1 px-2 transition outline-none w-full text-2xl focus:border-3 ${state?.errors?.firstName ? "border-light-error-border focus:border-light-error-border bg-light-error-bg text-light-error-text dark:text-dark-error-text dark:bg-dark-error-bg dark:border-dark-error dark:focus:border-dark-error" : 'focus:border-light-secondary dark:focus:border-dark-secondary '}`}/>
                    {state?.errors?.firstName && (
                        <p className={"text-2xl text-light-error-text dark:text-dark-error-text"}>
                            {state.errors.firstName[0]}
                        </p>
                    )}
                </article>
                <article className={"my-5"}>
                    <label  className={`text-3xl ${state?.errors?.lastName ? "text-light-error-text dark:text-dark-error-text" : 'text-light-text dark:text-dark-text-secondary'}`}>Last Name</label>
                    <input  type={"text"}
                            defaultValue={state.inputs?.lastName}
                            name={"lastName"}
                            required
                            minLength={2}
                            maxLength={50}
                            className={`mt-1 border-2 dark:border-dark-text-secondary rounded-xl p-1 px-2 transition outline-none w-full text-2xl focus:border-3 ${state?.errors?.lastName ? "border-light-error-border focus:border-light-error-border bg-light-error-bg text-light-error-text dark:text-dark-error-text dark:bg-dark-error-bg dark:border-dark-error dark:focus:border-dark-error" : 'focus:border-light-secondary dark:focus:border-dark-secondary '}`}/>
                    {state?.errors?.lastName && (
                        <p className={"text-2xl text-light-error-text dark:text-dark-error-text"}>
                            {state.errors.lastName[0]}
                        </p>
                    )}
                </article>
                <article className={"relative"}>
                    <label
                        className={`text-2xl ${state?.errors?.terms ? "text-light-error-text dark:text-dark-error-text" : 'text-light-text dark:text-dark-text-secondary'}`}>
                        Accept our terms
                    </label>
                    <input type={"checkbox"}
                        // required
                           name={"terms"}
                           onChange={() => setIsChecked(!isChecked)}
                           className={`absolute left-[190px] top-[8px] border-2 appearance-none w-5 h-5 ${state?.errors?.terms ? "border-light-error-border focus:border-light-error-border bg-light-error-bg text-light-error-text dark:text-dark-error-text dark:bg-dark-error-bg dark:border-dark-error-border dark:checked:border-dark-error-border" : `  dark:focus:border-dark-secondary ${isChecked ? "border-light-main dark:border-dark-main" : "border-light-secondary dark:border-dark-text"} `}`}/>
                    <div className={`absolute left-[192px] top-[18px] ${isChecked ? "" : "hidden"}`}>
                        <span className={`bg-light-text dark:bg-dark-text w-[10px] h-[2px] rounded-full absolute transition rotate-45`}></span>
                        <span className={`bg-light-text dark:bg-dark-text w-[10px] h-[2px] rounded-full absolute transition translate-x-[60%] rotate-135`}></span>
                    </div>
                </article>
                {state?.errors?.terms && (
                    <p className={"mt-2 text-2xl text-light-error-text dark:text-dark-error-text"}>
                        {state.errors.terms[0]}
                    </p>
                )}
                <article className={"mt-10 relative text-center"}>
                    <button type={"submit"}
                            disabled={isPending}
                            className={"text-2xl px-5 py-4 m-auto bg-light-secondary dark:bg-dark-bg-secondary active:bg-light-tertiary dark:active:bg-[#4a426ec9] text-light-text-secondary dark:text-dark-text rounded-lg transition hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"}>
                        {isPending ? 'Creating account..' : 'Create Account' }</button>
                </article>

            </form>
        </div>
    );
}