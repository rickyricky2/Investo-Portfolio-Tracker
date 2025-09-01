"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {subscriptionPlans} from "@/lib/subscriptionPlans";

export default function ProductClient() {
    const [subscriptionDuration, setSubscriptionDuration] = useState("monthly");
    const [subscription, setSubscription] = useState("");

    const saveProduct = (type: string) => {
        setSubscription(type);
        localStorage.setItem("subscriptionDuration", subscriptionDuration);
        localStorage.setItem("subscriptionType", type);
    };

    const changeDuration = (duration: string) => {
        setSubscriptionDuration(duration);
        setSubscription("");
        localStorage.removeItem("subscriptionType");
    };

    useEffect(() => {
        const storedSubscriptionDuration = localStorage.getItem("subscriptionDuration");
        const storedSubscriptionType = localStorage.getItem("subscriptionType");

        if (storedSubscriptionDuration) setSubscriptionDuration(storedSubscriptionDuration);
        if (storedSubscriptionType) setSubscription(storedSubscriptionType);
        else setSubscriptionDuration("monthly");
    }, []);

    return (
        <div className="flex flex-col justify-center items-center py-15 px-1">
            <div>
                <h1 className="text-5xl sm:text-7xl text-wrap text-center">Choose Your Plan</h1>
                <section className="text-3xl sm:text-4xl flex cursor-pointer justify-center">
                    <h2
                        className={`min-w-[150px] sm:w-[15rem] text-center my-5 pb-2 border-b-2 ${
                            subscriptionDuration === "monthly" ? "border-light-main dark:border-dark-main" : "border-dark-text-secondary dark:border-dark-text-secondary"
                        }`}
                        onClick={() => changeDuration("monthly")}
                    >
                        Monthly
                    </h2>
                    <h2
                        className={`min-w-[150px] sm:w-[15rem] text-center my-5 pb-2 border-b-2 ${
                            subscriptionDuration === "yearly" ? "border-light-main dark:border-dark-main" : "border-dark-text-secondary dark:border-dark-text-secondary"
                        }`}
                        onClick={() => changeDuration("yearly")}
                    >
                        Yearly
                    </h2>
                </section>
            </div>

            <div className="flex flex-wrap gap-10 sm:gap-15 justify-center items-center my-10">
                {subscriptionPlans.map((item,index) => {
                    return(
                        <div
                            key={index}
                            className={`bg-light-bg dark:bg-dark-bg-tertiary p-4 pt-5 pb-10 min-w-70 w-9/10 max-w-90 sm:w-120 sm:max-w-200 min-h-[450px] sm:min-h-[450px] rounded-4xl transition-all hover:cursor-pointer border-2 border-transparent hover:-translate-y-3 hover:shadow-2xl ${
                                subscription === `${item.name}` ? "border-light-main dark:border-dark-main -translate-y-3 shadow-2xl" : ""
                            }`}
                            onClick={() => saveProduct(item.name)}
                        >
                            <div className="text-center border-b-1 border-light-secondary dark:border-dark-secondary py-1 pb-5">
                                <h2 className="text-5xl pb-5">{item.name}</h2>
                                <p className="text-4xl">
                                    {subscriptionDuration === "monthly" ? item.monthlyPrice : item.yearlyPrice}$/
                                    <span className="text-2xl text-dark-text-tertiary dark:text-dark-text-tertiary">{subscriptionDuration === "monthly" ? "Month" : "Year"}</span>
                                </p>
                                {subscriptionDuration === "yearly" && (
                                    <div className="tracking-normal font-medium text-dark-text-tertiary dark:text-dark-text-secondary">
                                        <p>For 1 year</p>
                                        <p className="font-medium">After a year, it is brought {item.monthlyPrice}$/Month</p>
                                    </div>
                                )}
                            </div>
                            <div className="py-2 mb-5">
                                <ul className="text-2xl text-left p-5">
                                    {item.includes.map((item,index) => {
                                        return(
                                            <li key={index} className="relative list-disc text-light-main dark:text-dark-main">
                                                {/*<span className="w-2 h-2 rounded-full bg-light-text dark:bg-dark-text absolute bottom-3 -left-5"></span>*/}
                                                <span className={"text-light-text dark:text-dark-text-secondary"}>{item}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            {item.name === "Free" ? (
                                <h3 className="text-center tracking-normal font-semibold text-dark-text-tertiary">No credit card info needed!</h3>

                            ) : ""}
                        </div>
                    );
                })}
            </div>

            <Link
                href="/create-account"
                className="px-4 py-4 bg-light-secondary dark:bg-dark-bg-secondary active:bg-light-tertiary dark:active:bg-dark-bg-secondary text-3xl rounded-lg text-light-text-secondary dark:text-dark-text my-2 hover:scale-105 hover:-translate-y-2 transition-all"
            >
                Continue
            </Link>
        </div>
    );
}