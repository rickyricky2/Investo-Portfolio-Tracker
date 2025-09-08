import {Asset} from "@/types/assets";
import React, { lazy, Suspense, useEffect, useState, useRef} from "react";
import {FaSpinner} from "react-icons/fa";

const PieChart = lazy( () => import("./PieChart"));

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

    const useWindowWidth = () => {
        const [width, setWidth] = useState<number | null>(null);

        useEffect(() => {
            const handleResize = () => setWidth(window.innerWidth);
            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        return width;
    }

    const LazyPieChartWrapper = (props:{isLoading:boolean;assets:Asset[];type:string;width:number|null;}) => {
        const [show, setShow] = useState(false);
        const ref = useRef<HTMLDivElement>(null);

        useEffect( () => {
            const obs = new IntersectionObserver( ([entry]) => {
                if(entry.isIntersecting){
                    setShow(true);
                    obs.disconnect();
                }
            });
            if(ref.current) obs.observe(ref.current);
            return () => obs.disconnect();
        },[]);

        return (
            <div ref={ref}>
                {show && (
                    <Suspense fallback={<FaSpinner className="animate-spin text-4xl mx-auto text-light-main dark:text-dark-main" size={40} />}>
                        <PieChart {...props} />
                    </Suspense>
                )}
            </div>
        );
    }

    const width = useWindowWidth();

    return(
        <div>
            <section className={"grid lg:grid-cols-2 gap-10"}>
                <LazyPieChartWrapper isLoading={isLoading} assets={assets} type={"value"} width={width} />
                <LazyPieChartWrapper isLoading={isLoading} assets={assets} type={"quantity"} width={width}/>
                <LazyPieChartWrapper isLoading={isLoading} assets={assets} type={"type"} width={width} />
                <LazyPieChartWrapper isLoading={isLoading} assets={assets} type={"currency"} width={width} />
            </section>
        </div>
    );
}

const PieCharts = React.memo(PieChartsComponent);

export default PieCharts;