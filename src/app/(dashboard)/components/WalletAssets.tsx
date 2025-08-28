"use client";
import {useState, useEffect} from "react";
import {Asset,SortKey,SortConfig} from "@/types/assets";
import WalletTable from "../components/WalletTable";
import {walletProps} from "@/types/wallet";
import {useWalletStore} from "@/store/useWalletStore";
import {typesWithTicker} from "@/content/assetContent";
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


    // { label:"Portfolio", key:"portfolioPercentage" },

    // { label:"Total Purchase Price", key:"purchaseTotalPrice" },
];
function formatDate(date:string) {
    const formatedDate = new Date(date);
    return formatedDate.toLocaleString("pl-PL",{
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export default function WalletAssets({filters}: {filters: Filters}){
    const [assets, setAssets] = useState<Asset[]>([]);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sortConfig,setSortConfig] = useState<SortConfig>({key:null, direction:"asc"});

    const getAssets = async () =>{
        setIsLoading(true);

        const res = await fetch("/api/user/assets",{
            method: "GET",
        });

        const data = await res.json();

        setIsLoading(false);

        if(!data.success){
            setError(data?.error);
            console.error(data?.error);
        }

        const assets = data.assets;
        // for every asset
        for(const asset in assets){
            // check if asset was added manualy
            assets[asset].createdAt =  formatDate(assets[asset].createdAt);

            if(!assets[asset].addedManually) {
                //  check if we have this ticker in dataStore
                const ticker = assets[asset].ticker;
                const country = assets[asset].country;

                const res = await fetch(`/api/dataStore?ticker=${encodeURIComponent(ticker)}&country=${country}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });

                const dataStore = await res.json();

                if(!dataStore.success) {
                    // if we dont have asset in data Store we fetch for new data
                    // probably will never be used but i want it anyway
                    let res = await fetch(`/api/stockMarketAPI?ticker=${ticker}&country=${country}`, {
                        method: "GET",
                        headers:{"Content-Type": "application/json"},
                    });

                    const data = await res.json();

                    if(!data.success) {
                        console.error(`could not fetch asset: ${assets[asset]._id} data`);
                        continue;
                    }

                    assets[asset].lastUnitPrice = Number(data.tickerInfo.close).toFixed(2);
                    assets[asset].dailyChange = Number(data.tickerInfo.change).toFixed(2);
                    assets[asset].dailyChangePercent = Number(data.tickerInfo.percent_change).toFixed(2);

                    res = await fetch("/api/dataStore",{
                        method:"POST",
                        headers:{"Content-Type": "application/json"},
                        body: JSON.stringify({asset: assets[asset]}),
                    })
                }else{
                    assets[asset].lastUnitPrice = Number(dataStore.tickerInfo.lastUnitPrice).toFixed(2);
                    assets[asset].dailyChange = Number(dataStore.tickerInfo.dailyChange).toFixed(2);
                    assets[asset].dailyChangePercent = Number(dataStore.tickerInfo.dailyChangePercent).toFixed(2);
                }
            }else{
                if(!(typesWithTicker.includes(assets[asset].type))){
                    assets[asset].lastUnitPrice = assets[asset].purchaseUnitPrice;
                }
                assets[asset].dailyChange = "";
                assets[asset].dailyChangePercent = "";
            }
            assets[asset].totalValue = assets[asset].lastUnitPrice ? assets[asset].lastUnitPrice * assets[asset].quantity : assets[asset].purchaseUnitPrice * assets[asset].quantity  ;
            assets[asset].profit_loss = Number(assets[asset].totalValue - assets[asset].purchaseUnitPrice * assets[asset].quantity).toFixed(2);
            assets[asset].profit_lossPercent = Number( (assets[asset].totalValue - assets[asset].purchaseUnitPrice * assets[asset].quantity) / assets[asset].purchaseUnitPrice * 100).toFixed(2);
            assets[asset].lastUnitPrice = Number(assets[asset].lastUnitPrice).toFixed(2);
            assets[asset].dailyChange = Number(assets[asset].dailyChange).toFixed(2);
            assets[asset].dailyChangePercent =  Number(assets[asset].dailyChangePercent).toFixed(2);
        }
        setAssets(assets);
    }

    const { refreshTrigger } = useWalletStore();

    useEffect(()=> {
        getAssets();
        }, [refreshTrigger]);

    const sortAssets = (data: Asset[]) => {
        const {key, direction} = sortConfig;
        if(!key) return data;

        return [...data].sort((a,b)=> {
           const aValue = a[key];
           const bValue = b[key];

           if(typeof aValue === "number" && typeof bValue === "number") {
               return direction === "asc" ? aValue - bValue : bValue - aValue;
           }

            const aStr = String(aValue ?? '');
            const bStr = String(bValue ?? '');

           return direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
        });
    }

    const filteredAssets = assets.filter((asset) => {
        const matchesType = filters.type === "all" || asset.type === filters.type;
        const matchesCurrency = filters.currency === "all" || asset.currency === filters.currency;
        const matchesCountry = filters.country === "all" || asset.country === filters.country;
        const matchesSearch =
            filters.search === "" ||
            asset.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            (asset.ticker && asset.ticker.toLowerCase().includes(filters.search.toLowerCase()));
        return matchesType && matchesCurrency && matchesCountry && matchesSearch;
    });

    const sortedFilteredAssets = sortAssets(filteredAssets);

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

    const totalPortfolioValue = assets.reduce((sum,asset) => sum + (asset.totalValue || 0), 0);

    const getPortfolioPercentage = (assetValue:number) =>{
        if(totalPortfolioValue === 0) return 0;
        return ((assetValue/totalPortfolioValue) * 100).toFixed(2);
    }
    const commonProps: walletProps = {
        tableHeaders,
        sortedFilteredAssets,
        handleSort,
        sortConfig,
        getAssets,
        isLoading,
        getPortfolioPercentage,
        error,
    };

        return <WalletTable {...commonProps} />;
};
