"use client";
import {ResponsiveLine} from "@nivo/line";
import React, {useEffect, useMemo, useState} from "react";
import {useAuth} from "@/app/(dashboard)/components/AuthContext";
import {FaSpinner} from "react-icons/fa";
import {HistoricalPrice} from "@/types/stooq";
import LineChartFilter from "@/app/(dashboard)/components/LineChartFilter";
import BenchmarkFilter from "@/app/(dashboard)/components/BenchmarkFilter";

type Snapshot = {
    date: string;
    value: number;
};

export type indexFilter = {
    "S&P500":{
        active:boolean,
        ticker:string,
        currency:string,
    };
    "WIG20":{
        active:boolean,
        ticker:string,
        currency:string,
    },
    "DE40":{
        active:boolean,
        ticker:string,
        currency:string,
    }
}

function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

export const getRandomColor = (str:string) => {
    const hash = hashString(str);

    const hue = hash % 360;
    const saturation = 40 + (hash % 20);
    const lightness = 45 + (hash % 20);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export default function BenchmarkChart(){
    const [userSnapshots, setUserSnapshots] = useState<Snapshot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mainCurrency,setMainCurrency] = useState<string>("");
    const [firstDate, setFirstDate] =  useState<string>("");
    const [dateFilter, setDateFilter] = useState<string>("all");
    const [indexFilter, setIndexFilter] = useState({
        "S&P500": {
            active: false,
            ticker: "^SPX",
            currency: "USD",
        },
        "WIG20": {
            active: false,
            ticker: "WIG20",
            currency: "PLN",
        },
        "DE40": {
            active: false,
            ticker: "^DAX",
            currency: "EUR",
        },
    });
    const [benchmarkData, setBenchmarkData] = useState<Record<string, Snapshot[]>>({});

    const {data} = useAuth();

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        setMainCurrency(localStorage.getItem("mainCurrency") || "USD");

        const saved = localStorage.getItem("index_list");
        const indexList = saved ? JSON.parse(saved) : ["WIG20"];
        setIndexFilter({
            "S&P500": { active: indexList.includes("S&P500"), ticker: "^SPX", currency: "USD" },
            "WIG20": { active: indexList.includes("WIG20"), ticker: "WIG20", currency: "PLN" },
            "DE40": { active: indexList.includes("DE40"), ticker: "^DAX", currency: "EUR" },
        });

    }, []);

    useEffect(() => {
        if(!mainCurrency || !data || !data.loggedIn) return;

        const fetchUserSnapshots = async () => {
            try {
                setIsLoading(true);
                const userId =  data.user!.id;
                const resWalletSnapshots = fetch(`${baseURL}/api/user/walletSnapshots?userId=${userId}`,{
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const resRates = fetch(`https://api.frankfurter.app/latest?from=USD`);

                const [snapshotsData, ratesData] = await Promise.all([
                    resWalletSnapshots.then(res => res.json()),
                    resRates.then(res => res.json())
                ]);
                setFirstDate(snapshotsData.snapshots[0].date);
                if(snapshotsData.success) {
                    let convertedSnapshots = snapshotsData.snapshots;

                    if(mainCurrency !== "USD"){
                        if(ratesData){
                            convertedSnapshots = snapshotsData.snapshots.map( (snapshot:Snapshot) => ({
                                ...snapshot,
                                value: Number(snapshot.value) * Number(ratesData.rates[mainCurrency])
                            }));
                        }
                    }
                    setUserSnapshots(convertedSnapshots);
                }else{
                    console.error("Failed to get snapshots");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserSnapshots();
    }, [data,mainCurrency]);

    useEffect( () => {
        const fetchBenchmarkData = async () => {
            const activeIndexes = Object.entries(indexFilter)
                .filter(([,params]) => params.active)
                .map(([key]) => key as keyof indexFilter);
            for(const index of activeIndexes){
                if(!benchmarkData[index]){
                    let exchangeRatesRes: Promise<Record<string,boolean|number>> | null = null;
                    if(indexFilter[index].currency !== mainCurrency){
                        exchangeRatesRes = fetch(`/api/exchangeRates?base=${indexFilter[index].currency}&mainCurrency=${mainCurrency}`)
                            .then(res => res.json());
                    }
                    const fetchFromStooqRes = fetch(`/api/fetchFromStooq?ticker=${indexFilter[index].ticker}&purchaseDate=${firstDate}`)
                        .then(res => res.json());
                    const [rates, stooqData] = await Promise.all([
                        exchangeRatesRes ?? Promise.resolve(null),
                        fetchFromStooqRes,
                        ]);
                    const prices = stooqData.prices || [];
                    setBenchmarkData( prev => ({
                        ...prev,
                        [index]: prices.map( (p:HistoricalPrice) => ({
                            date: p.date,
                            value:
                                indexFilter[index].currency === mainCurrency
                                    ? p.close
                                    : p.close * Number(rates?.rate ?? 1)
                        }))
                    }));
                }
            }
        }
        if(firstDate){
            fetchBenchmarkData();
        }
    },[indexFilter,firstDate]);


    const chartData = useMemo( () => {
        const baseData = [
            {
                id: "User Wallet",
                color: "hsl(260, 70%, 50%)",
                data: userSnapshots
                    .filter(s => dateFilter === "all" || dateFilter === s.date.split('-')[0])
                    .map((s) => ({
                    x: new Date(s.date).toLocaleDateString(),
                    y: Number(s.value.toFixed(2)),
                })),
            },
        ];

        const benchmarks = Object.entries(benchmarkData)
            .filter( ([index]) => indexFilter[index as keyof indexFilter]?.active)
            .map(([index,snapshots]) => ({
            id: index,
            color:getRandomColor(index),
            data: snapshots
                .filter(s => dateFilter === "all" || dateFilter === s.date.split('-')[0])
                .map((s) => ({
                x: new Date(s.date).toLocaleDateString(),
                y: Number(s.value.toFixed(2)),
            })),
        }));
        return [...baseData, ...benchmarks];
    },[userSnapshots, benchmarkData, indexFilter]);

    return (
        <div className="min-h-[700px] w-full my-5 shadow-2xl rounded-4xl bg-light-bg-secondary dark:bg-dark-bg-tertiary py-6 px-2 tiny:px-6 select-none">
            <div className={"grid grid-cols-1 md:grid-cols-3 px-2"}>
                <h2 className={"text-2xl font-medium dark:text-dark-text-secondary"}>
                    Summary
                </h2>
                <LineChartFilter firstDate={firstDate} filter={dateFilter} onFilterChange={setDateFilter} />
                <div>
                    <BenchmarkFilter filters={indexFilter} onFilterChange={setIndexFilter} />
                </div>
            </div>
            <div className={"h-[700px] "}>
                {isLoading ? (
                    <div className={" h-[700px] flex justify-center items-center"}>
                        <FaSpinner className="animate-spin text-4xl text-light-main dark:text-dark-main" />
                    </div>
                    ) : (
                <ResponsiveLine
                    data={chartData}
                    margin={{ top: 50, right: 20, bottom: 60, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{
                        type: "linear",
                        min: "auto",
                        max: "auto",
                        stacked: false,
                        reverse: false,
                    }}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -40,
                        legend: "Date",
                        legendOffset: 50,
                        legendPosition: "middle",
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: `Portfolio Value (${mainCurrency})`,
                        legendOffset: -50,
                        legendPosition: "middle",
                    }}
                    theme={{
                        crosshair:{
                            line:{
                                stroke: "var(--color-light-main)",
                                strokeWidth:2,
                                strokeDasharray:"8 5",
                            },
                        },
                        grid:{
                            line:{
                                stroke: "var(--color-dark-tertiary)",
                                strokeWidth: 0.5,
                            },
                        },
                        axis: {
                            ticks: {
                                text: {
                                    fill: "var(--color-chart-axis)",
                                },
                            },
                            legend: {
                                text: {
                                    fill: "var(--color-light-text)",
                                    fontSize: 18
                                },
                            },
                        },
                        legends: {
                            text: {
                                fill: "var(--color-light-text)",
                                fontSize: 14
                            },
                        },
                    }}
                    colors={ {scheme: 'category10'} }
                    pointSize={0}
                    pointColor={ "var(--color-light-main)"}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: "seriesColor" }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    enableSlices={false}
                    tooltip={({ point }) => (
                        <div
                            className={`
                                   px-4 py-3 rounded-lg shadow
                                   bg-light-bg-tertiary dark:bg-dark-bg
                                   text-light-text dark:text-dark-text-secondary
                                   font-medium min-w-[150px]
                                   `}
                        >
                            <strong>{point.seriesId}</strong><br />
                            Date: {point.data.xFormatted}<br/>
                            Value: {point.data.yFormatted} {mainCurrency}
                        </div>
                    )}
                />
                    )}
            </div>
        </div>
    );
}
