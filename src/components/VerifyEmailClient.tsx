"use client";

import "@/app/global.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailClient() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState({ type: "loading", message: "" });
    const [email, setEmail] = useState("");
    const [resendStatus, setResendStatus] = useState({ type: "idle", message: "" });

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus({ type: "error", message: "Invalid token" });
                return;
            }

            try {
                const res = await fetch("/api/verify-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setStatus({ type: "error", message: data.error });
                    setEmail(data.email);
                } else {
                    setStatus({ type: "success", message: "Verified email successfully" });
                }
            } catch (error: any) {
                setStatus({ type: "error", message: error.message });
            }
        };

        verify();
    }, []);

    async function resendVerification(email: string) {
        if (!email) {
            setResendStatus({ type: "error", message: "Invalid email" });
            return;
        }

        try {
            const res = await fetch("/api/resend-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok || !data) {
                setResendStatus({ type: "error", message: data?.error || "Unknown error" });
                return;
            }

            setResendStatus({ type: "success", message: data.message });
        } catch (error: any) {
            console.error(error.message);
            setResendStatus({ type: "error", message: error.message });
        }
    }

    return (
        <div className="container text-3xl bg-gray-100 min-h-screen min-w-screen flex justify-center items-center tracking-tight text-center p-5">
            {status.type === "loading" && <p>Verifying...</p>}

            {status.type === "success" && (
                <div>
                    <h1 className="text-4xl md:text-7xl">Thanks for verifying your email.</h1>
                    <p className="my-3">Now you can go to the login page and sign in.</p>
                </div>
            )}

            {status.type === "error" && (
                <div>
                    <p className="text-red-600">{status.message}</p>

                        <button
                            disabled={resendStatus.type === "loading"}
                            onClick={() => resendVerification(email)}
                            className="mt-4 px-4 py-2 bg-[#49416D] text-white rounded hover:scale-105 transition-all"
                        >
                            Resend verification link
                        </button>

                    {resendStatus.type === "success" && (
                        <p className="mt-2 text-green-600">{resendStatus.message}</p>
                    )}
                    {resendStatus.type === "error" && (
                        <p className="mt-2 text-red-500">{resendStatus.message}</p>
                    )}
                </div>
            )}
        </div>
    );
}