import PieChart from "./PieChart";
import {Asset} from "@/types/assets";
import React from "react";

export type PieChartData = {
    id:string;
    label:string;
    value:number;
    color:string
}[];

function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

export const getRandomPurple = (str:string) => {
    const hash = hashString(str);

    const hue = 260 + (hash % 40);
    const saturation = 40 + (hash % 30);
    const lightness = 60 + (hash % 20);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

function PieChartsComponent({isLoading, assets} : {isLoading: boolean; assets: Asset[];}){

    return(
        <div>
            <section className={"grid lg:grid-cols-2 gap-10"}>
                <PieChart isLoading={isLoading} assets={assets} type={"value"} />
                <PieChart isLoading={isLoading} assets={assets} type={"quantity"}/>
                <PieChart isLoading={isLoading} assets={assets} type={"type"} />
                <PieChart isLoading={isLoading} assets={assets} type={"currency"} />
            </section>
        </div>
    );
}

const PieCharts = React.memo(PieChartsComponent);

export default PieCharts;