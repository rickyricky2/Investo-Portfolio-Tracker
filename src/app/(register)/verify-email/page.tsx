import VerifyEmailClient from "@/components/VerifyEmailClient";
import PublicHeader from "@/components/publicHeader";
import {Props} from "@/types/Props";

import {Metadata} from "next";
export const metadata: Metadata = {
    title: "Verify Email | Investo",
    description: "Investment tracking site",
};


export default async function VerifyEmailPage({ searchParams }: Props) {
    const params = await searchParams;
    const token = params.token as string | undefined;
    return (
        <div className={"w-full bg-light-bg dark:bg-dark-bg"}>
            <PublicHeader />
            <VerifyEmailClient token={token} />
        </div>
    );
}