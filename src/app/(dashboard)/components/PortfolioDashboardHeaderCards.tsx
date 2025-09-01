import "@/app/global.css";
import {FaSpinner} from "react-icons/fa";
import React from "react";
import { AiFillDollarCircle, AiFillCopy ,AiOutlineStock, AiOutlineFall } from "react-icons/ai";
import { FaWallet } from "react-icons/fa";

export default function PortfolioDashboardHeaderCards({totalBalance, values, isLoading, currency}: {totalBalance: number; values: {label:string, value:number, percent?:number;}[]; isLoading:boolean; currency:string } ) {
    return(
        <div>
            <section className={"min-h-[150px] bg-[linear-gradient(130deg,var(--color-light-main),hsl(300,70%,80%))] dark:bg-[linear-gradient(130deg,var(--color-dark-main),hsl(266,70%,78%))] w-full shadow-lg rounded-4xl overflow-hidden font-medium"}>
                <div className={"text-2xl p-5 "}>
                    <div className={`w-[40px] h-[40px] rounded-2xl flex justify-center items-center bg-[hsl(266,56%,80%)] text-white dark:bg-[hsl(266,20%,30%)] dark:text-dark-text-secondary`}>
                        <FaWallet size={25}/>
                    </div>
                    {isLoading ? (
                        <FaSpinner className="animate-spin text-4xl mx-auto text-light-main dark:text-dark-main" />
                    ) : <p className={`text-light-text-secondary dark:text-dark-text mt-3 text-2xl `}>{totalBalance.toFixed(2)} {currency}</p>}
                    <p className={"text-[#E9D9F9] dark:text-dark-on-main text-lg"}>Your total balance</p>
                </div>
            </section>
            <section className={`grid grid-cols-1 320:grid-cols-2 lg:grid-cols-3 gap-5 font-medium transition-all mt-5 tracking-tighter`}>
                {values.map( (item,index) => {
                    return (
                        <div key={index} className={"w-full min-h-[150px] shadow-lg rounded-4xl overflow-hidden bg-light-bg-secondary dark:bg-dark-bg-tertiary"}>
                            <div className={`text-2xl p-5 `}>
                                <div className={`${index === 2 ? item.value > 0 ? "text-green-500 bg-[hsl(80,60%,90%)]" : item.value < 0 ? "text-light-error-text dark:text-dark-error-text bg-[hsl(0,60%,90%)] dark:bg-dark-error-bg" : "text-light-main dark:text-dark-main bg-[hsl(260,60%,90%)] dark:bg-[hsl(258,20%,65%)] " : "text-light-main dark:text-[hsl(258,20%,65%)] bg-[hsl(260,60%,90%)] dark:bg-[hsl(258,25%,35%)]" } w-[45px] h-[45px] rounded-2xl flex justify-center items-center `}>
                                {index === 0 ? <AiFillDollarCircle size={35}/> : index === 1 ? <AiFillCopy size={35}/> : item.value > 0 ? <AiOutlineStock size={35}/> : <AiOutlineFall size={35} /> }
                                </div>
                                {isLoading ? (
                                    <FaSpinner className="animate-spin text-4xl mx-auto text-light-text-tertiary dark:text-dark-text-tertiary" />
                                ) : <p className={`mt-3 text-2xl ${index === 2 && item.value > 0 ? "text-green-500" : index === 2 && item.value < 0 ? "text-light-error-text dark:text-dark-error-text" : "" }`}>{ index === 2 ? item.value > 0 ? `+${item.value} ${currency} (+${item.percent}%)` : `${item.value} ${currency} (${item.percent}%)` : index === 0 ? `${item.value} ${currency}` : item.value }</p>}
                                <p className={"text-dark-text-secondary text-lg"}>{item.label}</p>
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}