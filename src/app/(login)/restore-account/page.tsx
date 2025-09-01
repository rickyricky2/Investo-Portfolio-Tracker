import "@/app/global.css";
import Header from "@/components/publicHeader"
import RestoreAccountClient from "@/components/RestoreAccountClient"
import {Props} from "@/types/Props";

export default async function RestoreAccount({ searchParams }: Props) {
    const params = await searchParams;
    const token = params.token as string | undefined;
    return(
        <div className={"text-light-text dark:text-dark-text w-full min-h-screen tracking-tight"}>
            <Header/>
            <div className={"flex flex-col gap-10 sm:gap-40 h-[600px] sm:h-[800px] px-2 tiny:px-5"}>
                <div className={"bg-light-bg-secondary dark:bg-dark-bg-tertiary shadow-2xl rounded-lg max-w-160 h-auto m-auto font-medium"}>
                    <div className={"text-2xl my-5 p-5 "}>
                        <RestoreAccountClient token={token}/>
                    </div>
                </div>
            </div>
        </div>
    );
}