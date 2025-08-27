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

    return(
        <div className={`rounded-md bg-light-bg-secondary dark:bg-dark-bg-secondary shadow-sm w-full p-10 min-h-[500px] ${isLoading ? "flex justify-center items-center" : ""}`}>
            {isLoading ? (
                <FaSpinner className="animate-spin text-4xl mx-auto text-light-main dark:text-dark-main" size={40} />
            ) : (
                <>
                    <AssetFilters filters={filters} onFilterChange={setFilters}/>
                    <div className={"relative min-h-[300px] "}>
                        <h2 className="text-3xl font-semibold text-center mt-5 border-b-3 px-4 py-1 w-fit mx-auto border-light-main dark:border-dark-main">
                            {chartTitles[type] || "Chart"}
                        </h2>
                        <div  className={`relative min-h-[${width !== null && width > 1500 ? "600px" : width !== null && width < 1024 ? width < 600 ? width < 500 ? "500px" : "400px" : "500px" : "400px" }] `}>
                        <ResponsivePie
                            data={data}
                            valueFormat={value => `${( (value / totalCount) * 100).toFixed(1)}%`}
                            margin={{ top: 80, right: 0, bottom: 80, left: 0 }}
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
                            enableArcLinkLabels={width !== null && width > 500}
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
                                                bg-light-bg-secondary dark:bg-dark-bg-secondary
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {data.map(d => (
                            <div key={d.id} className="flex items-center gap-2 text-sm">
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
