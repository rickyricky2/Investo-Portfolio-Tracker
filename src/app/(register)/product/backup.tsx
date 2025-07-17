
import "../../global.css";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Product(){
    const [subscriptionDuration,setSubscriptionDuration]=useState("monthly");
    const [subscription,setSubscription]=useState("");

    const saveProduct = (type:string) =>{
        setSubscription(type);
        localStorage.setItem("subscriptionDuration",subscriptionDuration);
        localStorage.setItem("subscriptionType",type);

    }

    const changeDuration = (duration:string) =>{
        setSubscriptionDuration(duration)
        setSubscription("");
        localStorage.removeItem("subscriptionType");

    }

    useEffect(() => {
        const storedSubscriptionDuration = localStorage.getItem('subscriptionDuration');
        const storedSubscriptionType = localStorage.getItem('subscriptionType');
        storedSubscriptionDuration ? setSubscriptionDuration(storedSubscriptionDuration) : null;
        storedSubscriptionType ? setSubscription(storedSubscriptionType) : setSubscriptionDuration("monthly");

    }, []);

    return(
        <div className={"container min-h-screen min-w-screen bg-gray-100 tracking-wider overflow-hidden"}>
            <div className={"flex flex-col justify-center items-center py-20"}>
                <div>
                    <h1 className={"text-7xl"}>Choose Your Plan</h1>
                    <section className={"text-4xl flex cursor-pointer justify-center"}>
                        <h2 className={`w-[15rem] text-center my-5 pb-2 border-b-2 
                        ${subscriptionDuration === "monthly" ? "border-[#A882DD]" : "border-gray-300" }`}
                            onClick={ () => changeDuration("monthly")}>Monthly</h2>
                        <h2 className={`w-[15rem] text-center my-5 pb-2 border-b-2 
                        ${subscriptionDuration === "yearly" ? "border-[#A882DD]" : "border-gray-300" }`}
                            onClick={ () => changeDuration("yearly")}>Yearly</h2>
                    </section>
                </div>
                <div className={"flex flex-wrap gap-15 justify-center items-center my-10"}>
                    <div className={`p-4 pt-5 pb-10 min-w-70 w-120 max-w-200 min-h-[450px] rounded-sm border-2  
                    transition-all hover:cursor-pointer hover:border-[#A882DD] hover:-translate-y-3 hover:shadow-md 
                    ${subscription === "Free" ? "border-[#A882DD] border-3 -translate-y-3 shadow-md" : "border-gray-400" }`}
                         onClick={ () => saveProduct("Free") }>
                        <div className={"text-center border-b-1 border-gray-400 py-1 pb-5"}>
                            <h2 className={"text-5xl pb-5"}>Free</h2>
                            <p className={"text-4xl"}>0 zł/<span className={"text-2xl text-gray-500"}>{subscriptionDuration === "monthly" ? "Month": "Year"}</span></p>
                            {subscriptionDuration === "monthly" ? "" : <div className={"tracking-normal"}>
                                <p className={""}>For 1 year</p>
                                <p className={"font-medium"}>After a year, it is brought 0/month</p>
                            </div>}
                        </div>
                        <div className={"py-2 mb-5"}>
                            <ul className={"text-2xl text-left p-5"}>
                                <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Add all your assets</li>
                                <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Trace your investments</li>
                                <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Watch your money growth</li>
                            </ul>
                        </div>
                        <h3 className={"text-center tracking-normal font-semibold"}>No credit card info needed!</h3>
                    </div>
                    <div className={`p-4 pt-5 pb-10 min-w-70 w-120 max-w-200 min-h-[450px] rounded-sm border-2  
                    transition-all hover:cursor-pointer hover:border-[#A882DD] hover:-translate-y-3 hover:shadow-md 
                    ${subscription === "Standard" ? "border-[#A882DD] border-3 -translate-y-3 shadow-md" : "border-gray-400" }`}
                         onClick={ () => saveProduct("Standard") }>
                        <div className={"text-center border-b-1 border-gray-400 py-1 pb-5"}>
                            <h2 className={"text-5xl pb-5"}>Standard</h2>
                            <p className={"text-4xl"}>{4.99*11} zł/<span className={"text-2xl text-gray-500"}>{subscriptionDuration === "monthly" ? "Month": "Year"}</span></p>
                            {subscriptionDuration === "monthly" ? "" : <div className={"tracking-normal"}>
                                <p className={""}>For 1 year</p>
                                <p className={"font-medium"}>After a year, it is brought {4.99*11} zł/month</p>
                            </div>}
                        </div>
                        <div className={"py-2 mb-5"}>
                            <ul className={"text-2xl text-left p-5"}>
                                <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Add all your assets</li>
                                <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Trace your investments</li>
                                <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Watch your money growth</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Link href={"/create-account"} className={"px-4 py-4 bg-[#49416D] text-3xl rounded-lg text-gray-100 my-2 hover:scale-110 hover:-translate-y-2 transition-all"}
                >Continue</Link>
            </div>
        </div>
    );
}