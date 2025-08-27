import "@/app/global.css";
import {FaSpinner} from "react-icons/fa";
import React from "react";

export default function PortfolioDashboardHeader( {values, isLoading, currency}: {values: {label:string, value:number, percent?:number;}[]; isLoading:boolean; currency:string } ) {
    return(
        <section className={`flex flex-col lg:flex-row lg:flex-wrap gap-10 font-medium`}>
            {values.map( (item,index) => {
                return (
                    <div key={index} className={"w-full lg:w-1/3 lg:flex-1 shadow-sm rounded-md overflow-hidden"}>
                        <div className={`bg-light-bg-secondary  dark:bg-dark-bg-secondary text-2xl p-5`}>
                            <p className={"text-dark-text-secondary"}>{item.label}</p>
                            {isLoading ? (
                                <FaSpinner className="animate-spin text-4xl mx-auto text-light-main dark:text-dark-main" />
                            ) : <p className={`text-center my-5 text-3xl ${index === 2 && item.value > 0 ? "text-green-500" : index === 2 && item.value < 0 ? "text-light-error-text dark:text-dark-error-text" : "" }`}>{ index === 2 ? item.value > 0 ? `+${item.value} ${currency} (+${item.percent}%)` : `${item.value} ${currency} (${item.percent}%)` : index === 0 ? `${item.value} ${currency}` : item.value }</p>}
                        </div>
                        <div
                            className={"bg-light-main dark:bg-dark-main h-[2px] "}></div>
                    </div>
                );
            })}
        </section>
    );
}