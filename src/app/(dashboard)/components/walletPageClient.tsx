"use client";
import WalletAssets from "./WalletAssets";
import WalletHeader from "./WalletHeader";
import {useState} from "react";

export default function WalletPageClient(){
    const [filters, setFilters] = useState({
        type: "all",
        currency: "all",
        search: ""
    });

    return(
        <div className={"flex flex-col gap-5"}>
            <WalletHeader filters={filters} onFilterChange={setFilters} />
            <WalletAssets filters={filters}/>
        </div>
    );
}