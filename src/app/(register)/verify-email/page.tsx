import VerifyEmailClient from "@/components/VerifyEmailClient";
import PublicHeader from "@/components/publicHeader";

import {Metadata} from "next";
export const metadata: Metadata = {
    title: "Verify Email | Investo",
    description: "Investment tracking site",
};


export default function VerifyEmailPage() {
    return (
        <div className={"w-full bg-light-bg dark:bg-dark-bg"}>
            <PublicHeader />
            <VerifyEmailClient />
        </div>
    );
}