import VerifyEmailClient from "@/components/VerifyEmailClient";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: "Investo - Verify Email",
    description: "Investment tracking site",
};


export default function VerifyEmailPage() {
    return <VerifyEmailClient />;
}