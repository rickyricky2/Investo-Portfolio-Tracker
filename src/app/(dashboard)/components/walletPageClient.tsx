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
        <div className={"flex flex-col gap-2 lg:gap-5"}>
            <WalletHeader filters={filters} onFilterChange={setFilters}/>
            <WalletAssets filters={filters}/>
        </div>
    );
}