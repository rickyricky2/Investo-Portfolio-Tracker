"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { FaSpinner } from "react-icons/fa";
import {useAuth} from "@/app/(dashboard)/components/AuthContext";

type Snapshot = {
    date: string;
    value: number;
};

function MainChartComponent({mainCurrency}: {mainCurrency: string}) {
    const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const {data} = useAuth();

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        if(!mainCurrency || !data || !data.loggedIn) return;

        const fetchSnapshots = async () => {
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
                    setSnapshots(convertedSnapshots);
                }else{
                    console.error("Failed to get snapshots");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSnapshots();
    }, [data,mainCurrency]);

    const chartData = useMemo( () => [
        {
            id: "Portfolio Value",
            color: "hsl(260, 70%, 50%)",
            data: snapshots.map((s) => ({
                x: new Date(s.date).toLocaleDateString(),
                y: Number(s.value.toFixed(2)),
            })),
        },
    ],[snapshots]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[400px] my-10">
                <FaSpinner className="animate-spin text-4xl text-light-main dark:text-dark-main" />
            </div>
        );
    }

    return (
        <div className="min-h-[500px] w-full my-5 shadow-lg rounded-4xl bg-light-bg-secondary dark:bg-dark-bg-tertiary py-6 px-2 tiny:px-6 select-none">
            <h2 className={"text-2xl font-medium px-2"}>
                Summary
            </h2>
            <div className={"h-[400px]"}>
            <ResponsiveLine
                data={chartData}
                margin={{ top: 50, right: 20, bottom: 60, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: true,
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
                                fill: "var(--color-dark-text-secondary)",
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
                colors={"var(--color-light-main)"}
                pointSize={5}
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
                                   font-medium
                                   `}
                    >
                        <strong>{point.seriesId}</strong><br />
                        Date: {point.data.xFormatted}<br/>
                        Value: {point.data.yFormatted} {mainCurrency}
                    </div>
                )}
            />
            </div>
        </div>
    );
}

const MainChart = React.memo(MainChartComponent);

export default MainChart;