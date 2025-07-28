"use client";
import WalletAssets, {WalletAssetsRef} from "./WalletAssets";
import WalletHeader from "./WalletHeader";
import {useState,useRef} from "react";

export default function WalletPageClient(){
    const [filters, setFilters] = useState({
        type: "all",
        currency: "all",
        search: ""
    });

    const walletRef = useRef<WalletAssetsRef>(null);

    return(
        <div className={"flex flex-col gap-5"}>
            <WalletHeader filters={filters} onFilterChange={setFilters}
            onAdded={() => walletRef.current?.refresh()}/>
            <WalletAssets ref={walletRef} filters={filters}/>
        </div>
    );
}