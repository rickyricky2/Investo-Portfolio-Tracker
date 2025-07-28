"use client";
import { FaSort, FaSpinner } from "react-icons/fa";
import {useState, useEffect,forwardRef,useImperativeHandle} from "react";
import {Asset,SortKey,SortConfig} from "@/types/assets";
import AssetModifyMenu from "../components/AssetModifyMenu";

export type WalletAssetsRef = {
    refresh: () => void;
}

const tableHeaders: {label:string, key:SortKey}[] = [
    { label:"Type", key:"type" },
    { label:"Name", key:"name" },
    { label:"Symbol", key:"symbol" },
    { label:"Quantity", key:"quantity" },
    { label:"Unit Price", key:"unitPrice" },
    { label:"Total Value", key:"totalValue" },
    { label:"Currency", key:"currency" },
    { label:"Portfolio", key:"portfolioPercentage" },
    { label:"Daily Change", key:"dailyChange" },
];

const WalletAssets = forwardRef<WalletAssetsRef, {filters: {type:string; currency:string; search:string}}>(({filters},ref) => {
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
        }

        console.log(data.assets);
        setAssets(data.assets);
    }

    useEffect(()=>{ getAssets(); },[]);

    useImperativeHandle(ref, () => ({
        refresh: getAssets
    }))

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
        const matchesSearch =
            filters.search === "" ||
            asset.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            (asset.symbol && asset.symbol.toLowerCase().includes(filters.search.toLowerCase()));
        return matchesType && matchesCurrency && matchesSearch;
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

    return(
        <main className={"bg-white dark:bg-dark-bg w-full h-screen rounded-2xl px-5 shadow-sm tracking-tight overflow-hidden"}>
            <table className={"w-full px-5"}>
                <thead className="w-full">
                    <tr className="w-full border-b-2 rounded-4xl border-[#A882DD]">
                        {tableHeaders.map( (item,index) => {
                            return(
                                <th key={index} >
                                    <div className={"flex items-center gap-1 justify-center text-lg my-2 font-medium"}>
                                        {item.label}
                                        <FaSort onClick={()=> handleSort(item.key)} className={"cursor-pointer "} />
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                {isLoading && (
                    <tr>
                        <td colSpan={tableHeaders.length} className="text-center py-10">
                            <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto" />
                        </td>
                    </tr>
                )}
                {!isLoading && assets && (
                    sortedFilteredAssets.map((asset,index)=>{
                        return(
                            <tr key={index} className="odd:bg-gray-200 rounded-4xl text-center text-xl font-medium">
                                <td>{asset.type}</td>
                                <td>{asset.name}</td>
                                <td>{asset.symbol ? asset.symbol : "-"}</td>
                                <td>{asset.quantity ? asset.quantity : "-"}</td>
                                <td>{asset.unitPrice ? asset.unitPrice : "-"}</td>
                                <td>{asset.totalValue}</td>
                                <td>{asset.currency}</td>
                                <td>{getPortfolioPercentage(asset.totalValue)}%</td>
                                <td>{asset.dailyChange ? asset.dailyChange : "-"}</td>
                                <td><AssetModifyMenu id={asset._id}  refresh={getAssets}/></td>
                            </tr>
                        );
                    })
                )}
                {error && (
                    <tr><td colSpan={9}>{error}</td></tr>
                )}
                </tbody>
            </table>
        </main>
    );
});
WalletAssets.displayName = "WalletAssets";
export default WalletAssets;