"use client";
import PortfolioDashboardHeaderCards from './PortfolioDashboardHeaderCards';
import MainChart from "./MainChart";
import PieCharts from "./PieCharts";
//import {typesWithTicker} from "@/content/assetContent";
import {useEffect, useState} from "react";
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

    const baseURL = process.env.PUBLIC_BASE_URL || "http://localhost:3000";

    const getAssets = async () =>{
        setIsLoading(true);
        const res = await fetch(`${baseURL}/api/user/assets`,{
            method: "GET",
        });

        const data = await res.json();

        if(!data.success){
            setIsLoading(false);
            console.error(data?.error);
        }

        const assets = data.assets;
        let tempNumberOfInvestments = 0;
        let tempTotalInvestedAmount = 0;
        let tempTotalProfitLoss = 0;
        let tempTotalInvestmentsValue = 0;
        let tempMainCurrency= "";
        let tempTotalProfitLossPercent = 0;

        for(const asset in assets){

            tempNumberOfInvestments = tempNumberOfInvestments + 1;
            tempTotalInvestedAmount = tempTotalInvestedAmount + (Number(assets[asset].purchaseUnitPrice) * Number(assets[asset].quantity));

            if(assets[asset].addedManually){
                assets[asset].dailyChange = 0;
                assets[asset].dailyChangePercent = 0;
            }

            tempMainCurrency = localStorage.getItem("mainCurrency") || "USD";

            if(assets[asset].currency !== tempMainCurrency){
                const res = await fetch(`${baseURL}/api/exchangeRates?base=${assets[asset].currency}&mainCurrency=${tempMainCurrency}`,{
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });

                const data = await res.json();

                if(!data.success) {
                    console.error("ERROR");
                }
                assets[asset].purchaseUnitPrice = Number(Number(assets[asset].purchaseUnitPrice * data.rate).toFixed(2));
                assets[asset].lastUnitPrice = Number(Number(assets[asset].lastUnitPrice * data.rate).toFixed(2));
            }

            assets[asset].profit_loss = Number(Number(assets[asset].lastUnitPrice - assets[asset].purchaseUnitPrice).toFixed(2));
            assets[asset].profit_lossPercent = Number(Number( (assets[asset].lastUnitPrice - assets[asset].purchaseUnitPrice) / assets[asset].purchaseUnitPrice * 100).toFixed(2));
            assets[asset].dailyChange = Number(Number(assets[asset].dailyChange).toFixed(2));
            assets[asset].dailyChangePercent =  Number(Number(assets[asset].dailyChangePercent).toFixed(2));
            assets[asset].totalValue = assets[asset].lastUnitPrice ? assets[asset].lastUnitPrice * assets[asset].quantity : assets[asset].purchaseUnitPrice * assets[asset].quantity;

            tempTotalInvestmentsValue = tempTotalInvestmentsValue + (Number(assets[asset].lastUnitPrice) * Number(assets[asset].quantity)) ;
            tempTotalProfitLoss = tempTotalProfitLoss + assets[asset].profit_loss!;
            tempTotalProfitLossPercent = tempTotalProfitLossPercent + assets[asset].profit_loss! / Number(assets[asset].purchaseUnitPrice) * 100;
        }

        setAssets(assets);

        setNumberOfInvestments( tempNumberOfInvestments );
        setTotalInvestedAmount( tempTotalInvestedAmount );
        setTotalProfitLoss( tempTotalProfitLoss);
        setTotalProfitLossPercent(tempTotalProfitLossPercent);
        setTotalInvestmentsValue( tempTotalInvestmentsValue);
        setMainCurrency(tempMainCurrency);

        setIsLoading(false);
    }

    const { refreshTrigger } = useWalletStore();

    useEffect(()=> {
        getAssets();
    }, [refreshTrigger]);

    useEffect( () => {
        const getUserInfo = async () => {
            setIsLoading(true);
            const res = await fetch(`${baseURL}/api/auth/me`);
            const data = await res.json();
            if(!data.success){
                throw Error(data.error);
            }
            setUser(data.user);
            setIsLoading(false);
        }
        getUserInfo();
    },[]);

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
            <h2 className={"text-4xl lg:text-5xl tracking-tight text-left text-light-main font-bold dark:text-dark-main flex flex-col"}>
                Hi
                <span className={"mt-2 capitalize"}>
                {user.firstName + (user.lastName ? " " + user.lastName : "")}!
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
