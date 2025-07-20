"use client";
import {useState, useEffect} from "react";

export default function walletPage(){
    const [assets, setAssets] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        const getData = async () =>{
            setIsLoading(true);

            const res = await fetch("/api/assets",{
                method: "GET",
            });

            const data = await res.json();

            if(!data.success){
                setError("Could not fetch your data");
            }

            setAssets(data.assets);
        }
        // getData();
    });

    return(
        <main className={"bg-white w-full h-screen rounded-2xl px-5 shadow-sm tracking-tight overflow-hidden"}>
            <table className={"w-full px-5"}>
                <thead className="">
                    <tr className="border-b-2 rounded-4xl border-[#A882DD]">
                        <th>Type</th>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Value</th>
                        <th>Currency</th>
                        <th>Portfolio</th>
                        <th>Daily Change</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t border-gray-300 rounded-4xl text-center">
                        <td>Akcje</td>
                        <td>Apple</td>
                        <td>AAPL</td>
                        <td>10</td>
                        <td>150 USD</td>
                        <td>1,500 USD</td>
                        <td>USD</td>
                        <td>15%</td>
                        <td>+1,2%</td>
                    </tr>
                {/*{*/}
                {/*    assets.map((asset,index)=>{*/}
                {/*        return (*/}
                {/*            <tr key={index} className="border-t border-gray-300 rounded-4xl text-center">*/}
                {/*                <td>asset.type</td>*/}
                {/*                <td>asset.name</td>*/}
                {/*                <td>asset.symbol ? asset.symbol : "-"</td>*/}
                {/*                <td>asset.quantity ? asset.quantity : "-"</td>*/}
                {/*                <td>asset.unitPrice ? asset.unitPrice : "-"</td>*/}
                {/*                <td>asset.totalValue</td>*/}
                {/*                <td>asset.currency</td>*/}
                {/*                <td>asset.portfolio</td>*/}
                {/*                <td>asset.dailyChange ? asset.dailyChange : "-"</td>*/}
                {/*            </tr>*/}
                {/*        );*/}
                {/*    })*/}
                {/*}*/}
                </tbody>
            </table>
        </main>
    );
}