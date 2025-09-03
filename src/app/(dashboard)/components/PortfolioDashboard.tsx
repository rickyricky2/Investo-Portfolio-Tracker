"use client";
import PortfolioDashboardHeaderCards from './PortfolioDashboardHeaderCards';
import MainChart from "./MainChart";
import PieCharts from "./PieCharts";
import React, {useEffect, useState} from "react";
import {Asset} from "@/types/assets";
import {useWalletStore} from "@/store/useWalletStore";

type userData = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export default function PortfolioDashboard(){
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<userData>({} as userData);

    const [totalInvestedAmount,setTotalInvestedAmount] = useState(0);
    const [numberOfInvestments,setNumberOfInvestments] = useState(0);
    const [totalInvestmentsValue,setTotalInvestmentsValue] = useState(0);
    const [totalProfitLoss,setTotalProfitLoss] = useState(0);
    const [totalProfitLossPercent,setTotalProfitLossPercent] = useState(0);
    const [mainCurrency,setMainCurrency] = useState("");

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const getAssets = async () =>{
        const res = await fetch(`${baseURL}/api/user/assets`,{
            method: "GET",
        });

        const data = await res.json();

        if(!data.success){
            setIsLoading(false);
            console.error(data?.error);
        }

        const assets = data.assets;
        let tempMainCurrency= "";

        const promises = assets.map( async (asset:Asset) =>{
            const temp = {...asset};

            if(temp.addedManually){
                temp.dailyChange = 0;
                temp.dailyChangePercent = 0;
            }else{
                temp.dailyChange = Number(Number(temp.dailyChange).toFixed(2));
                temp.dailyChangePercent =  Number(Number(temp.dailyChangePercent).toFixed(2));
            }

            tempMainCurrency = localStorage.getItem("mainCurrency") || "USD";

            if(temp.currency !== tempMainCurrency){
                const res = await fetch(`${baseURL}/api/exchangeRates?base=${temp.currency}&mainCurrency=${tempMainCurrency}`,{
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
                const data = await res.json();
                if(data.success) {
                    temp.purchaseUnitPrice = Number(Number(temp.purchaseUnitPrice * data.rate).toFixed(2));
                    temp.lastUnitPrice = Number(Number(temp.lastUnitPrice * data.rate).toFixed(2));
                }
            }

            if(temp.purchaseUnitPrice && Number(temp.purchaseUnitPrice) > 0){
                temp.profit_loss = Number(Number(temp.lastUnitPrice - temp.purchaseUnitPrice).toFixed(2));
                temp.profit_lossPercent = Number(Number( (temp.lastUnitPrice - temp.purchaseUnitPrice) / temp.purchaseUnitPrice * 100).toFixed(2));
            }else{
                temp.profit_loss = 0;
                temp.profit_lossPercent = 0;
            }
            temp.totalValue = temp.lastUnitPrice ? temp.lastUnitPrice * temp.quantity : temp.purchaseUnitPrice * temp.quantity;

            return temp;
        });

        const normalizedAssets = await Promise.all(promises);

        let totalInvestedAmount = 0;
        let totalInvestmentsValue = 0;
        let totalNumberOfInvestments = 0;

        normalizedAssets.forEach((asset) => {
            totalInvestedAmount += (Number(asset.purchaseUnitPrice) || 0) * (Number(asset.quantity) || 0);
            totalInvestmentsValue += asset.totalValue || 0;
            totalNumberOfInvestments += 1;
        });

        const totalProfitLoss = totalInvestedAmount > 0 ? totalInvestmentsValue - totalInvestedAmount : 0;
        const totalProfitLossPercent = totalInvestedAmount > 0 ? (totalProfitLoss/totalInvestedAmount) * 100 : 0;

        setAssets(normalizedAssets);
        setNumberOfInvestments( totalNumberOfInvestments );
        setTotalInvestedAmount( Number(totalInvestedAmount.toFixed(2)) );
        setTotalProfitLoss( totalProfitLoss);
        setTotalProfitLossPercent( totalProfitLossPercent);
        setTotalInvestmentsValue( totalInvestmentsValue);
        setMainCurrency(tempMainCurrency);

    }
    const getUserInfo = async () => {
        const res = await fetch(`${baseURL}/api/auth/me`);
        const data = await res.json();
        if(!data.success){
            throw Error(data.error);
        }
        setUser(data.user);
    }

    const { refreshTrigger } = useWalletStore();

    useEffect(()=> {
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([getUserInfo(),getAssets()]);
            setIsLoading(false);
        }
        fetchData();
    }, [refreshTrigger]);

    const headerValues = [
        {
            label: "Total Invested Amount",
            value: totalInvestedAmount,
        },
        {
            label: "Number of Investment",
            value: numberOfInvestments,
        },
        {
            label: "Profit / Loss",
            value: Number(totalProfitLoss.toFixed(2)),
            percent: Number(totalProfitLossPercent.toFixed(2)),
        }
    ];

    return(
        <div className={"px-2"}>
            <header className={"my-5 px-2"}>
                <h2 className={"text-4xl bg-[linear-gradient(130deg,var(--color-light-main),hsl(300,70%,78%))] dark:bg-[linear-gradient(130deg,var(--color-dark-main),hsl(266,50%,35%))] bg-clip-text text-transparent lg:text-5xl tracking-tight text-left font-bold  flex flex-col"}>
                    Hi
                    <span className={"my-2 capitalize"}>
                        {isLoading ? (
                            <div className="w-24 h-6 bg-transparent rounded animate-pulse"/>
                        ) : (
                            <span>{user.firstName}!</span>
                        )}
                    </span>
                </h2>
            </header>
            <main className={`
                   text-light-text dark:text-dark-text
                    w-full min-h-screen tracking-tight overflow-auto`}
            >
                <PortfolioDashboardHeaderCards totalBalance={totalInvestmentsValue} values={headerValues} isLoading={isLoading} currency={mainCurrency}/>
                <MainChart mainCurrency={mainCurrency} />
                <PieCharts isLoading={isLoading} assets={assets} />
            </main>
        </div>
    );
}
