import "@/app/global.css";
import Header from "@/components/publicHeader"
import RestoreAccountClient from "@/components/RestoreAccountClient"
import {Metadata} from "next";
export const metadata: Metadata = {
    title: "Restore Account | Investo",
    description: "Investment tracking site",
};

export default async function RestoreAccount({ searchParams }: { searchParams: { token?: string } }){
    const token = searchParams.token;
    return(
        <div className={"bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text w-full min-h-screen tracking-tight"}>
            <div className={"flex flex-col gap-10 sm:gap-40"}>
                <Header/>
                <div className={"sm:shadow-2xl sm:border-3 border-gray-400 dark:border-dark-text-secondary rounded-lg max-w-160 h-auto m-auto font-medium"}>
                    <div className={"text-2xl my-5 p-5 "}>
                        <RestoreAccountClient token={token}/>
                    </div>
                </div>
            </div>
        </div>
    );
}