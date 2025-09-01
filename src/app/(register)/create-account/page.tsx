import "../../global.css";
import CreateAccountForm from "@/components/CreateAccountForm";
import PublicHeader from "@/components/publicHeader";

import {Metadata} from "next";
export const metadata: Metadata = {
    title: "Create Account | Investo",
    description: "Investment tracking site",
};

export default function CreateAccountPage(){
    return(
        <div className="w-full tracking-tight min-h-screen text-light-text dark:text-dark-text-secondary">
            <PublicHeader/>
            <div className="flex justify-center items-center px-2 tiny:px-5">
                <main className="my-10 tracking-tight flex flex-col gap-10">
                    <h1 className="text-6xl text-center">Create An Account</h1>
                    <CreateAccountForm />
                </main>
            </div>
        </div>
    );
}