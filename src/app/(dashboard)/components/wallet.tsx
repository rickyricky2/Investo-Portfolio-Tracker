"use client";
import { FaSort } from "react-icons/fa";
import {useState, useEffect} from "react";
import {Asset,SortKey,SortConfig} from "@/types/assets";

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

export default function WalletAssets(){
    const [assets, setAssets] = useState<Asset[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sortConfig,setSortConfig] = useState<SortConfig>({key:null, direction:"asc"});

    useEffect(()=>{
        const getData = async () =>{
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
        getData();
    },[]);

    const sortAssets = (data: Asset[]) => {
        const {key, direction} = sortConfig;
        if(!key) return 0;

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
    return(
        <main className={"bg-white w-full h-screen rounded-2xl px-5 shadow-sm tracking-tight overflow-hidden"}>
            <table className={"w-full px-5"}>
                <thead className="w-full">
                    <tr className="w-full border-b-2 rounded-4xl border-[#A882DD]">
                        {tableHeaders.map( (item,index) => {
                            return(
                                <th key={index} onClick={()=> handleSort(item.key)}>
                                    <div className={"flex items-center gap-1 justify-center text-lg"}>
                                        {item.label}
                                        <FaSort />
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                {assets && (
                    assets.map((asset,index)=>{
                        return(
                            <tr key={index} className="border-t border-gray-300 rounded-4xl text-center text-lg">
                                <td>{asset.type}</td>
                                <td>{asset.name}</td>
                                <td>{asset.symbol ? asset.symbol : "-"}</td>
                                <td>{asset.quantity ? asset.quantity : "-"}</td>
                                <td>{asset.unitPrice ? asset.unitPrice : "-"}</td>
                                <td>{asset.totalValue}</td>
                                <td>{asset.currency}</td>
                                <td>{asset.portfolioPercentage}</td>
                                <td>{asset.dailyChange ? asset.dailyChange : "-"}</td>
                            </tr>
                        );
                    })
                )}
                {error && (
                    <p>{error}</p>
                )}
                </tbody>
            </table>
        </main>
    );
}