"use client";
import { ResponsivePie } from '@nivo/pie'
import {FaSpinner} from "react-icons/fa";
import {PieChartData,getRandomPurple} from "./PieCharts";
import {Asset} from "@/types/assets";
import AssetFilters from "../components/AssetFilters";
import {Filters} from "./walletPageClient";
import { useState, useEffect } from "react";

function useWindowWidth() {
    const [width, setWidth] = useState<number | null>(null);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        handleResize(); // ustawia od razu po załadowaniu
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
}

const chartTitles: Record<string, string> = {
    value: "Assets by Value",
    quantity: "Assets by Quantity",
    type: "Assets by Type",
    currency: "Assets by Currency",
};

export default function PieChart({isLoading,assets, type}: {isLoading:boolean; assets:Asset[]; type:string;}) {
    const [filters, setFilters] = useState<Filters>({
        type: "all",
        currency: "all",
        country: "all",
        search: "",
    });

    let data:PieChartData = [];
    let totalCount = 0;


    const getData = (assets: Asset[]) => {
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
                totalCount = type === "quantity"? totalCount + Number(asset.quantity) : type === "value" ? totalCount + (Number(asset.lastUnitPrice) * Number(asset.quantity)) : totalCount + 1 ;
                const value = type === "value" ? Number(asset.lastUnitPrice) * Number(asset.quantity) : type === "quantity" ? Number(asset.quantity) : 1;
                const name =  type  === "currency" ? asset.currency : type === "type" ? asset.type : asset.name;
                map[name] = (map[name] || 0) + value;

            }
        }

        data = Object.entries(map).map( ([key, val]) => ({
            id:key,
            label:key,
            value:val,
            color: getRandomPurple(key),
            percentage: ((val/ totalCount)).toFixed(1),
        }));
    }

    getData(assets);

    const width = useWindowWidth();
    let minPieChartHeight = "400px";

    if (width !== null) {
        if (width > 1500) {
            minPieChartHeight = "400px";
        }else if( width < 400){
            minPieChartHeight = "300px";
        } else if (width < 500) {
            minPieChartHeight = "400px";
        } else if (width < 600) {
            minPieChartHeight = "400px";
        } else if (width < 1024) {
            minPieChartHeight = "450px";
        }
    }
    return(
        <div className={`shadow-lg rounded-4xl bg-light-bg-secondary dark:bg-dark-bg-tertiary overflow-hidden w-full py-10 px-3 tiny:px-5 sm:px-10 min-h-[400px] ${isLoading ? "flex justify-center items-center" : ""}`}>
            {isLoading ? (
                <FaSpinner className="animate-spin text-4xl mx-auto text-light-main dark:text-dark-main" size={40} />
            ) : (
                <>
                    <div className={`relative min-h-[400px]`}>
                        <h2 className="text-3xl dark:text-dark-main font-semibold tracking-tight text-center mb-5 px-4 py-1 w-fit mx-auto ">
                            {chartTitles[type] || "Chart"}
                        </h2>
                        <AssetFilters filters={filters} onFilterChange={setFilters}/>
                        <div  className={`relative min-h-[${minPieChartHeight}] z-1 overflow-visible`}>
                        <ResponsivePie
                            data={data}
                            valueFormat={value => `${( (value / totalCount) * 100).toFixed(1)}%`}
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
                            enableArcLinkLabels={(width !== null && width > 700 && width < 1025) || (width !== null &&  width > 1500 )}
                            activeOuterRadiusOffset={8}
                            arcLinkLabelsSkipAngle={10}
                            // arcLinkLabelsTextColor="#333333"
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
                                    data: data.map(d => ({
                                        ...d,
                                        label: d.label.length > 10 ? d.label.slice(0, 10) + "…" + ` ${( (d.value / totalCount ) * 100).toFixed(2)}%` : d.label +` ${( (d.value / totalCount ) * 100).toFixed(2)}%`,
                                    })),
                                }
                            ]}
                            tooltip={({ datum }) => (
                                <div
                                    className={`
                                                px-3 py-2 rounded-lg shadow
                                                bg-light-bg-tertiary dark:bg-dark-bg-secondary
                                                text-light-text dark:text-dark-text
                                              `}
                                >
                                    <strong>{datum.id}</strong><br />
                                    {type === "value" ? `Value: ${datum.value}` : `Quantity: ${datum.value}`}
                                </div>
                            )}
                        />
                        </div>
                    </div>
                    {/*legend*/}
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
                        {data.map(d => (
                            <div key={d.id} className="flex items-center gap-2 text-sm font-medium text-dark-text-secondary">
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
