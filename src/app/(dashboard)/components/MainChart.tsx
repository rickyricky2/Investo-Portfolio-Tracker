"use client";

import { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { FaSpinner } from "react-icons/fa";

type Snapshot = {
    date: string;
    totalValue: number;
};


export default function MainChart({mainCurrency}: {mainCurrency: string}) {
    const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSnapshots = async () => {
            try {
                setIsLoading(true);
                let res = await fetch(`/api/auth/me`,{
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const userData = await res.json();
                if(!userData.success){
                    console.error(userData);
                    return;
                }
                const userId =  userData.user.id;
                res = await fetch(`/api/user/walletSnapshots?userId=${userId}`,{
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await res.json();
                console.log(data);
                if(data.success) {
                    setSnapshots(data.snapshots);
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
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[400px] my-10">
                <FaSpinner className="animate-spin text-4xl text-light-main dark:text-dark-main" />
            </div>
        );
    }

    const chartData = [
        {
            id: "Portfolio Value",
            color: "hsl(260, 70%, 50%)",
            data: snapshots.map((s) => ({
                x: new Date(s.date).toLocaleDateString(),
                y: s.totalValue,
            })),
        },
    ];

    return (
        <div className="h-[400px] w-full my-10 rounded-md bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm">
            <ResponsiveLine
                data={chartData}
                margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
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
                    tickRotation: -45,
                    legend: "Date",
                    legendOffset: 40,
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
                    axis: {
                        ticks: {
                            text: {
                                fill: "var(--color-light-text)",
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
                    tooltip: {
                        container: {
                            color: '#ffffff',
                            background: "var(--color-light-text)",
                        },
                    },
                }}
                colors={{ scheme: "purple_blue" }}
                pointSize={8}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                enableSlices="x"
            />
        </div>
    );
}