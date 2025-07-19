import "../../global.css";
import CreateAccountForm from "@/components/CreateAccountForm";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: "Create Account | Investo",
    description: "Investment tracking site",
};

export default function CreateAccountPage(){
    return(
        <div className="container tracking-tight min-h-screen min-w-screen bg-gradient-to-b from-gray-100 to-white">
            <div className="flex justify-center items-center">
                <main className="my-20 tracking-tight">
                    <h1 className="text-6xl text-center">Create An Account</h1>
                    <CreateAccountForm />
                </main>
            </div>
        </div>
    );
}