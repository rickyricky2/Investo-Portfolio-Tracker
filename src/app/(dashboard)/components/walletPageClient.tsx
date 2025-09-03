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
        <div className={"w-full min-h-screen my-5 px-2 flex flex-col gap-5 lg:gap-5 relative"}>
            <h2 className={"text-4xl lg:text-5xl bg-[linear-gradient(130deg,var(--color-light-main),hsl(300,70%,78%))] dark:bg-[linear-gradient(130deg,var(--color-dark-main),hsl(266,50%,35%))] bg-clip-text text-transparent px-2 tracking-tight text-left font-bold flex flex-col"}>
                My
                <span className={"mt-2 capitalize"}>
                Investments
                </span>
            </h2>
            <WalletHeader filters={filters}
                          onFilterChange={setFilters}/>
            <WalletAssets filters={filters}/>
        </div>
    );
}