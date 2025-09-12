import type {Metadata} from "next";
import "@/app/global.css";
import BenchmarkChart from "@/app/(dashboard)/components/BenchmarkChart";
import React from "react";

export const metadata: Metadata = {
    title: "Benchmark | Investo",
    description: "Benchmark",
    robots: "noindex, nofollow, noarchive, nosnippet",
};

export default function BenchmarkPage(){

    return(
        <div className={"min-h-screen w-full tracking-tight px-2 mb-20"}>
            <header className={"my-5 px-2"}>
                <h2 className={"text-4xl bg-[linear-gradient(130deg,var(--color-light-main),hsl(300,70%,78%))] dark:bg-[linear-gradient(130deg,var(--color-dark-main),hsl(266,50%,35%))] bg-clip-text text-transparent lg:text-5xl tracking-tight text-left font-bold  flex flex-col"}>
                    Wallet
                    <span className={"my-2 capitalize"}>
                        Benchmark
                    </span>
                </h2>
            </header>
            <BenchmarkChart />
        </div>
    );
}