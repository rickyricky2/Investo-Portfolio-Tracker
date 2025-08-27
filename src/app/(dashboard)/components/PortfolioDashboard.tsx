"use client";
import PortfolioDashboardHeader from './PortfolioDashboardHeader';
import MainChart from "../components/MainChart";
import PieCharts from "./PieCharts";
import {typesWithTicker} from "@/content/assetContent";
import {useEffect, useState} from "react";
import {Asset} from "@/types/assets";
import {useWalletStore} from "@/store/useWalletStore";

function formatDate(date:Date | string) {
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

export default function PortfolioDashboard(){
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [totalInvestedAmount,setTotalInvestedAmount] = useState(0);
    const [numberOfInvestments,setNumberOfInvestments] = useState(0);
    const [totalInvestmentsValue,setTotalInvestmentsValue] = useState(0);
    const [totalProfitLoss,setTotalProfitLoss] = useState(0);
    const [totalProfitLossPercent,setTotalProfitLossPercent] = useState(0);
    const [mainCurrency,setMainCurrency] = useState("");

    const getAssets = async () =>{

        setIsLoading(true);

        const res = await fetch("/api/user/assets",{
            method: "GET",
        });

        const data = await res.json();

        if(!data.success){
            setIsLoading(false);
            console.error(data?.error);
        }

        const assets:Asset[] = data.assets;
        let tempNumberOfInvestments = 0;
        let tempTotalInvestedAmount = 0;
        let tempTotalProfitLoss = 0;
        let tempTotalInvestmentsValue = 0;
        let tempMainCurrency= "";
        let tempTotalProfitLossPercent = 0;

        // for every asset
        for(const asset in assets){
            // first we save some info for dashboard
            tempNumberOfInvestments = tempNumberOfInvestments + 1;

            tempTotalInvestedAmount = tempTotalInvestedAmount + (Number(assets[asset].purchaseUnitPrice) * Number(assets[asset].quantity));

            assets[asset].createdAt =  formatDate(assets[asset].createdAt);
            // check if asset was added manualy
            if(!assets[asset].addedManually) {
                //  check if we have this ticker in dataStore
                const ticker = assets[asset].ticker;
                const country = assets[asset].country;

                const res = await fetch(`/api/dataStore?ticker=${encodeURIComponent(ticker!)}&country=${country}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });

                const dataStore = await res.json();

                let lastUnitPrice;
                let dailyChange ;
                let dailyChangePercent ;

                if(!dataStore.success) {
                    //we have to check if the last update in dataStore was later than hour ago
                    if(dataStore.code === "expired") {
                        lastUnitPrice = Number(dataStore.tickerInfo.lastUnitPrice);
                        dailyChange = Number(dataStore.tickerInfo.dailyChange);
                        dailyChangePercent = Number(dataStore.tickerInfo.dailyChange);
                    }

                    let res = await fetch(`/api/stockMarketAPI?ticker=${ticker}&country=${country}`, {
                        method: "GET",
                        headers:{"Content-Type": "application/json"},
                    });

                    const data = await res.json();

                    if(!data.success) {
                        if(dataStore.code === "expired") {
                            assets[asset].lastUnitPrice = Number(lastUnitPrice);
                            assets[asset].dailyChange = Number(dailyChange);
                            assets[asset].dailyChangePercent = Number(dailyChange);
                            continue;
                        }else {
                            continue;
                        }
                    }
                    lastUnitPrice = Number(Number(data.tickerInfo.close).toFixed(2));
                    dailyChange = Number(Number(data.tickerInfo.change).toFixed(2));
                    dailyChangePercent = Number(Number(data.tickerInfo.percent_change).toFixed(2));

                    assets[asset].lastUnitPrice = lastUnitPrice;
                    assets[asset].dailyChange =dailyChange;
                    assets[asset].dailyChangePercent = dailyChangePercent;

                    res = await fetch("/api/dataStore",{
                        method:"PUT",
                        headers:{"Content-Type": "application/json"},
                        body: JSON.stringify({ticker,country,lastUnitPrice,dailyChangePercent,dailyChange}),
                    })
                }else{
                    assets[asset].lastUnitPrice = dataStore.tickerInfo.lastUnitPrice;
                    assets[asset].dailyChange = dataStore.tickerInfo.dailyChange;
                    assets[asset].dailyChangePercent = dataStore.tickerInfo.dailyChangePercent;
                }
            }else{
                if(!(typesWithTicker.includes(assets[asset].type))){
                    assets[asset].lastUnitPrice = assets[asset].purchaseUnitPrice;
                }
                assets[asset].dailyChange = 0;
                assets[asset].dailyChangePercent = 0;
            }
            // we take main currency from localStorage or we use default currency
            tempMainCurrency = localStorage.getItem("MainCurrency") || "USD";

            if(assets[asset].currency !== tempMainCurrency){
                const res = await fetch(`/api/exchangeRates?base=${assets[asset].currency}&mainCurrency=${tempMainCurrency}`,{
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
        <div>
        <header className={"my-6 py-2"}>
            <h2 className={"text-3xl lg:text-5xl font-medium text-center text-light-text dark:text-dark-text-secondary"}>
                Total Wallet Value:
                <span className={"text-3xl lg:text-5xl dark:text-dark-text"}> {totalInvestmentsValue} {mainCurrency}</span>
            </h2>
        </header>
        <main className={`
                bg-light-bg dark:bg-dark-bg
                text-light-text dark:text-dark-text
                w-full min-h-screen tracking-tight overflow-auto`}
        >
            <PortfolioDashboardHeader values={headerValues} isLoading={isLoading} currency={mainCurrency}/>
            <MainChart mainCurrency={mainCurrency} />
            <PieCharts isLoading={isLoading} assets={assets} />
        </main>
        </div>
    );
}