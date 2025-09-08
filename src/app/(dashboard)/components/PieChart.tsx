"use client";
import { ResponsivePie } from '@nivo/pie'
import {FaSpinner} from "react-icons/fa";
import {PieChartData,getRandomPurple} from "./PieCharts";
import {Asset} from "@/types/assets";
import AssetFilters from "../components/AssetFilters";
import {Filters} from "./walletPageClient";
import React, { useState,useMemo, useCallback  } from "react";


const chartTitles: Record<string, string> = {
    value: "Assets by Value",
    quantity: "Assets by Quantity",
    type: "Assets by Type",
    currency: "Assets by Currency",
};

function PieChartComponent({isLoading,assets, type, width}: {isLoading:boolean; assets:Asset[]; type:string; width:number | null;}) {
    const [filters, setFilters] = useState<Filters>({
        type: "all",
        currency: "all",
        country: "all",
        search: "",
    });

    const {data, totalCount} = useMemo( ():{data:PieChartData;totalCount:number} => {
        let total = 0;
        const map: Record<string, number>= {};

        for(const asset of assets){
            const matchesType = filters.type === "all" || asset.type === filters.type;
            const matchesCurrency = filters.currency === "all" || asset.currency === filters.currency;
            const matchesCountry = filters.country === "all" || asset.country === filters.country;
            const matchesSearch =
                filters.search === "" ||
                asset.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                (asset.ticker && asset.ticker.toLowerCase().includes(filters.search.toLowerCase()));

            if(matchesType && matchesCurrency && matchesCountry && matchesSearch) {
                total = type === "quantity" ? total + Number(asset.quantity) : type === "value" ? total + (Number(asset.lastUnitPrice) * Number(asset.quantity)) : total + 1 ;
                const value = type === "value" ? Number(asset.lastUnitPrice) * Number(asset.quantity) : type === "quantity" ? Number(asset.quantity) : 1;
                const name =  type  === "currency" ? asset.currency : type === "type" ? asset.type : asset.name;
                map[name] = (map[name] || 0) + value;
            }
        }

        const chartData:PieChartData = Object.entries(map).map( ([key, val]) => ({
            id:key,
            label:key,
            value:val,
            color: getRandomPurple(key),
            percentage: ((val/ total)).toFixed(1),
        }));

        return {data: chartData, totalCount:Number(total.toFixed(2)) };
    },[assets,type,filters]);

    const minPieChartHeight = useMemo( () => {
        if(!width) return "400px";
        if (width > 1500) return "400px";
        if( width < 400) return "300px";
        if (width < 500) return "400px";
        if (width < 600) return "400px";
        if (width < 1024) return "450px";
    },[width]);

    const formatValue = useCallback(
        (value: number) => `${((value / totalCount) * 100).toFixed(1)}%`
        , [totalCount]);

    const memoizedLegendData = useMemo(() => data.map(d => ({
        ...d,
        label: d.label.length > 10 ? d.label.slice(0,10) + "…" : d.label
    })), [data]);

    return(
        <div className={`shadow-lg rounded-4xl bg-light-bg-secondary dark:bg-dark-bg-tertiary overflow-hidden w-full py-10 px-3 tiny:px-5 sm:px-10 min-h-[400px] ${isLoading ? "flex justify-center items-center" : ""}`}>
            {isLoading ? (
                <FaSpinner className="animate-spin text-4xl mx-auto text-light-main dark:text-dark-main" size={40} />
            ) : (
                <>
                    <div className={`relative min-h-[300px]`}>
                        <h2 className="text-4xl dark:text-dark-main font-semibold tracking-tight text-center mb-2 px-4 py-1 w-fit mx-auto ">
                            {chartTitles[type] || "Chart"}
                        </h2>
                        <h3 className={"text-2xl text-center mb-4 font-medium"}>
                            <span className={"dark:text-dark-text-secondary"}>Total value:</span> {totalCount}
                        </h3>
                        <AssetFilters filters={filters} onFilterChange={setFilters}/>
                        <div  className={`relative min-h-[${minPieChartHeight}] z-1 overflow-visible`}>
                        <ResponsivePie
                            data={data}
                            valueFormat={formatValue}
                            margin={{ top: 30, right: 40, bottom: 30, left: 40 }}
                            innerRadius={0.5}
                            padAngle={0.6}
                            colors={{ datum: "data.color" }}
                            theme={{
                                text: {
                                    fontSize:14,
                                    fill: "var(--color-light-text)",
                                },
                                legends:{
                                    text: {
                                        fill: "var(--color-light-text)",
                                    }
                                }
                            }}
                            cornerRadius={2}
                            enableArcLabels={true}
                            enableArcLinkLabels={ !!((width && width > 700 && width < 1025) || (width &&  width > 1500 ))}
                            activeOuterRadiusOffset={8}
                            arcLinkLabelsSkipAngle={10}
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor={{ from: 'var(--color-light-text)', modifiers: [['darker', 3]] }}
                            legends={[
                                {
                                    anchor: 'bottom',
                                    direction: 'column',
                                    translateY: -2000,
                                    translateX: -300,
                                    itemWidth: 180,
                                    itemHeight: 18,
                                    symbolShape: 'circle',
                                    itemTextColor: "var(--color-light-text)",
                                    data: memoizedLegendData,
                                }
                            ]}
                            tooltip={({ datum }) => (
                                <div
                                    className={`
                                                px-3 py-2 rounded-lg shadow
                                                bg-light-bg-tertiary dark:bg-dark-bg-secondary
                                                text-light-text dark:text-dark-text
                                                min-w-30
                                              `}
                                >
                                    <strong>{datum.id}</strong><br />
                                    {type === "value" ? `Value: ${datum.value}` : `Quantity: ${datum.value}`}<br/>
                                    Percent: <span className={"font-medium"}>{((datum.value / totalCount) * 100).toFixed(1)}%</span>
                                </div>
                            )}
                        />
                        </div>
                    </div>
                    {/*legend*/}
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
                        {data.map(d => (
                            <div key={d.id} className="flex items-center gap-2 text-sm font-medium text-chart-axis">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                {d.label} ({((d.value / totalCount) * 100).toFixed(1)}%)
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

const PieChart = React.memo(PieChartComponent);

export default PieChart;
