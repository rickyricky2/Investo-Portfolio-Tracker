"use client";
import WalletAssets from "./WalletAssets";
import WalletHeader from "./WalletHeader";
import React, {useState} from "react";

export type Filters = {
    type: string;
    currency: string;
    country: string;
    search: string;
}

export default function WalletPageClient(){
    const [filters, setFilters] = useState<Filters>({
        type: "all",
        currency: "all",
        country: "all",
        search: "",
    });

    return(
        <div className={"w-full min-h-screen my-5 px-2 flex flex-col gap-5 lg:gap-5"}>
            <h2 className={"text-4xl lg:text-5xl px-2 tracking-tight text-left text-light-main font-bold dark:text-dark-main flex flex-col"}>
                My
                <span className={"mt-2 capitalize"}>
                Investments
                </span>
            </h2>
            <WalletHeader filters={filters} onFilterChange={setFilters}/>
            <WalletAssets filters={filters}/>
        </div>
    );
}