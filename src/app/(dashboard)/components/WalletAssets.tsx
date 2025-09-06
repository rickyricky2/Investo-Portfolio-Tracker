"use client";
import {useState, useEffect, useMemo} from "react";
import {Asset,SortKey,SortConfig} from "@/types/assets";
import WalletTable from "../components/WalletTable";
import {walletProps} from "@/types/wallet";
import {useWalletStore} from "@/store/useWalletStore";
import {Filters} from "./walletPageClient";

export const tableHeaders: {label:string, key:SortKey}[] = [
    { label:"Ticker", key:"ticker" },
    { label:"Type", key:"type" },
    { label:"Name", key:"name" },
    { label:"Quantity", key:"quantity" },
    { label:"Purchase Price", key:"purchaseUnitPrice" },
    { label:"Last Price", key:"lastUnitPrice" },
    { label:"Total Value", key:"totalValue" },
    { label:"Currency", key:"currency" },
    { label:"Daily change", key:"dailyChange" },
    { label:"Profit/Loss", key:"profit_loss" },

    { label:"Country", key:"country" },
    { label:"CreatedAt", key:"createdAt" },
];

export default function WalletAssets({filters}: {filters: Filters;}){
    const [assets, setAssets] = useState<Asset[]>([]);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sortConfig,setSortConfig] = useState<SortConfig>({key:null, direction:"asc"});

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const getAssets = async () =>{
        setIsLoading(true);
        const res = await fetch(`${baseURL}/api/user/assets`,{
            method: "GET",
        });
        const data = await res.json();
        if(!data.success){
            setError(data?.error);
            console.error(data?.error);
        }

        const formattedAssets = data.assets.map( (asset:Asset) => {
            let dailyChange, dailyChangePercent;
            if(asset.addedManually){
                dailyChange = 0;
                dailyChangePercent = 0;
            }else{
                dailyChange = Number(Number(asset.dailyChange).toFixed(2));
                dailyChangePercent =  Number(Number(asset.dailyChangePercent).toFixed(2));
            }

            const totalValue = asset.lastUnitPrice
                ? asset.lastUnitPrice * asset.quantity
                : asset.purchaseUnitPrice * asset.quantity;

            const profit_loss = Number(Number(totalValue - (asset.purchaseUnitPrice * asset.quantity)).toFixed(2));
            const profit_lossPercent = Number(Number( (profit_loss / (asset.purchaseUnitPrice * asset.quantity)) * 100).toFixed(2));

            return {
                ...asset,
                dailyChange,
                dailyChangePercent,
                totalValue,
                profit_loss,
                profit_lossPercent,
            }
        });

        setAssets(formattedAssets);
        setIsLoading(false);
    }

    const { refreshTrigger } = useWalletStore();

    useEffect(()=> {
        getAssets();
        }, [refreshTrigger]);

    // const sortAssets = (data: Asset[]) => {
    //     const {key, direction} = sortConfig;
    //     if(!key) return data;
    //
    //     return [...data].sort((a,b)=> {
    //        const aValue = a[key];
    //        const bValue = b[key];
    //
    //        if(typeof aValue === "number" && typeof bValue === "number") {
    //            return direction === "asc" ? aValue - bValue : bValue - aValue;
    //        }
    //
    //         const aStr = String(aValue ?? '');
    //         const bStr = String(bValue ?? '');
    //
    //        return direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    //     });
    // }
    //
    // const filteredAssets = assets.filter((asset) => {
    //     const matchesType = filters.type === "all" || asset.type === filters.type;
    //     const matchesCurrency = filters.currency === "all" || asset.currency === filters.currency;
    //     const matchesCountry = filters.country === "all" || asset.country === filters.country;
    //     const matchesSearch =
    //         filters.search === "" ||
    //         asset.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    //         (asset.ticker && asset.ticker.toLowerCase().includes(filters.search.toLowerCase()));
    //     return matchesType && matchesCurrency && matchesCountry && matchesSearch;
    // });

    // const sortedFilteredAssets = sortAssets(filteredAssets);

    const sortedFilteredAssets = useMemo( () => {
        let data = assets;

        data = data.filter( asset => {
            const matchesType = filters.type === "all" || asset.type === filters.type;
            const matchesCurrency = filters.currency === "all" || asset.currency === filters.currency;
            const matchesCountry = filters.country === "all" || asset.country === filters.country;
            const matchesSearch =
                filters.search === "" ||
                asset.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                (asset.ticker && asset.ticker.toLowerCase().includes(filters.search.toLowerCase()));
            return matchesType && matchesCurrency && matchesCountry && matchesSearch;
        });

        const {key, direction} = sortConfig;
        if(key) {
            data = [...data].sort((a, b) => {
                const aValue = a[key];
                const bValue = b[key];

                if (typeof aValue === "number" && typeof bValue === "number") {
                    return direction === "asc" ? aValue - bValue : bValue - aValue;
                }

                const aStr = String(aValue ?? '');
                const bStr = String(bValue ?? '');

                return direction === "asc"
                    ? aStr.localeCompare(bStr)
                    : bStr.localeCompare(aStr);
            });
        }

        return data;
    },[assets,filters,sortConfig]);

    const handleSort = (key: SortKey) =>{
        setSortConfig(prev => {
            if(prev.key === key){
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                };
            }

            return {key,direction:"asc"};
        });
    }

    const commonProps: walletProps = {
        tableHeaders,
        sortedFilteredAssets,
        handleSort,
        getAssets,
        isLoading,
        error,
    };

        return <WalletTable {...commonProps} />;
};
