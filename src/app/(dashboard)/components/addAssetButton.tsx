"use client"
import {FaPlus, FaSpinner} from "react-icons/fa";
import React, { useState,useEffect, useRef } from 'react';
import { useWalletStore } from "@/store/useWalletStore";
import {z} from "zod";
import {formAssets,typesWithTicker,countries, currencies, assetTypes} from "@/content/assetContent";

let assetSchema;

export default function AddAssetButton(){
    const [isOpen,setIsOpen]=useState(false);
    const [error, setError]=useState("");
    const [isLoading, setIsLoading]=useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const triggerRefresh = useWalletStore((state) => state.triggerRefresh);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        const type = formData.get('type') as string;

        let rawData;

        // check if data has a ticker (is on stock market)
        if(!typesWithTicker.includes(type) || !notAddDataManually){

            // if not client has to type in all info through the form

            rawData = {
                ticker: formData.get("ticker") as string || "",
                type: type,
                name: formData.get('name') as string,
                quantity: Number(formData.get('quantity')),
                purchaseUnitPrice: Number(formData.get('purchaseUnitPrice')),
                lastUnitPrice: Number(formData.get('lastUnitPrice')),
                currency: formData.get('currency') as string,
                country: formData.get('country') as string || "",
                notAddedManually:  notAddDataManually,
            }

            // we add schema for validating this data
            assetSchema = z.object({
                ticker: z.string().optional(),
                type: z.string().min(1, "Asset type is required"),
                name: z.string().min(1,"Asset name is required"),
                quantity: z.number().min(1,"Quantity must be at least 1"),
                purchaseUnitPrice: z.number().positive("Unit price must be positive"),
                currency: z.string().min(1, "U must chose currency"),
                country: z.string().optional(),
            });

            const validateData = assetSchema.safeParse(rawData);

            if(!validateData.success){
                setError(validateData.error.errors[0].message);
                setIsLoading(false);
                return;
            }

            // we can save this in database

        }else{
            // if yes, we create schema for validating data

            assetSchema = z.object({
                ticker: z.string(),
                type: z.string().min(1, "Asset type is required"),
                name: z.string().min(1,"Asset name is required"),
                quantity: z.number().min(1,"Quantity must be at least 1"),
                purchaseUnitPrice: z.number().positive("Unit price must be positive"),
                lastUnitPrice: z.number().positive("Last price must be positive"),
                currency: z.string().min(1, "U must chose currency"),
                country: z.string().optional(),
            });
            //then we have to take some info from client.

            rawData = {
                type: type,
                ticker: formData.get("ticker") as string,
                country: formData.get("country") as string,
                quantity: Number(formData.get('quantity')),
            }

            const quantity = rawData.quantity;

            // then check if we have info about ticker in dataStore db and if ticker info is fresh

            const ticker = rawData.ticker as string;
            const country = rawData.country as string;

            let res = await fetch(`/api/dataStore?ticker=${encodeURIComponent(ticker)}&country=${country}`, {
                method:"GET",
                headers:{"Content-Type": "application/json"},
            });

            let data = await res.json();

            if(data.success){
            //     if we have this ticker data already stored

                const tickerData = data.tickerData;
                rawData = {
                    ...tickerData,
                    purchaseUnitPrice:tickerData.lastUnitPrice,
                    quantity,
                    country,
                }
            }else {
                if(data.code === "expired"){
                //     if we have expired prices we need to fetch for new ones and save it to dataStore
                //     we grab our data
                    const tickerData = data.tickerData;
                    rawData = {
                        ...tickerData,
                        quantity,
                        country,
                    }

                    // we call for api to fetch for prices

                    res = await fetch(`/api/stockMarketAPI?ticker=${ticker}&country=${country}`, {
                        method: "GET",
                        headers:{"Content-Type": "application/json"},
                    });

                    data = await res.json();

                    if(!data.success){
                        setError("We couldn't find ticker");
                        setIsLoading(false);
                        return;
                    }

                    const lastUnitPrice = Number(data.tickerInfo.close).toFixed(2);
                    const dailyChange = Number(data.tickerInfo.dailyChange).toFixed(2);
                    const dailyChangePercent = Number(data.tickerInfo.dailyChangePercent).toFixed(2);

                    // we make our data ready to save it
                    rawData.purchaseUnitPrice = lastUnitPrice;

                    // if we successfully grabbed prices data from API we need to save it to dataStore for other users
                    res = await fetch("/api/dataStore",{
                        method:"PUT",
                        headers:{"Content-Type": "application/json"},
                        body: JSON.stringify({ticker,country,lastUnitPrice, dailyChange, dailyChangePercent}),
                    })

                    data = await res.json();

                    if(data.success){
                        console.log("dataStore for this ticker updated");
                    }else{
                        console.log("Couldn't update dataStore for this ticker");
                    }
                }
                else{
                    // if we don't have data stored for this ticker we have to call API

                    // first we fetch for ticker data
                    res = await fetch(`/api/stockMarketAPI?ticker=${ticker}&country=${country}`, {
                        method: "GET",
                        headers:{"Content-Type": "application/json"},
                    });

                    data = await res.json();

                    if(!data.success){
                        setError("We couldn't find ticker u need to add information manually");
                        setIsLoading(false);
                        setNotAddDataManually(false);
                        return;
                    }


                    const tickerInfo = data.tickerInfo;
                    const lastUnitPrice = Number(tickerInfo.close).toFixed(2);

                    const currency = String(rawData.type).trim() === "crypto" ? String(tickerInfo.symbol).slice(-3) : tickerInfo.currency;

                    rawData = {
                        ...rawData,
                        name:tickerInfo.name,
                        purchaseUnitPrice:lastUnitPrice,
                        lastUnitPrice:lastUnitPrice,
                        currency: currency,
                        country:country,
                        dailyChange:tickerInfo.change,
                        dailyChangePercent:tickerInfo.percent_change,
                    }

                    //     if we successfully grabbed data from API we save this in dataStore for other users

                    res = await fetch("/api/dataStore", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({rawData}),
                    })

                    data = await res.json();

                    if(data.success){
                        console.log(data.message);
                    }else{
                        console.log(data.message);
                    }
                }

            }

        }
        console.log("POSTING: ",notAddDataManually);
        const res = await fetch("/api/user/assets",{
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({rawData, notAddDataManually}),
        });

        const data = await res.json();

        if(!data.success){
            setError("could not save data");
        }

        triggerRefresh();
        setIsOpen(false);
    }

    const [type, setType] = useState("");
    const [notAddDataManually,setNotAddDataManually] = useState(true);

    return(
        <div className={`lg:relative text-light-text-secondary dark:text-dark-text`} ref={wrapperRef}>
            <div className={`bg-light-tertiary scale-120 lg:scale-100 dark:bg-dark-secondary lg:bg-light-main lg:dark:bg-dark-main transition-all rounded-full cursor-pointer p-1 z-100 relative group `}  >
                <FaPlus className={`text-light-text-secondary dark:text-dark-text z-10 transition-all ${isOpen ? "rotate-45" : ""}`} size={30} onClick={() => setIsOpen(!isOpen)} />
                <p className={`${isOpen ? 'hidden' : "hidden lg:block"} absolute bottom-6 -left-7 group-hover:-translate-y-5 shadow-md rounded-md text-lg
                      w-25 p-2 scale-0 text-light-text bg-light-text-secondary dark:text-dark-text dark:bg-dark-secondary font-medium duration-175 overflow-hidden group-hover:scale-100 text-center
                `}>
                    Add Asset
                </p>
            </div>
            <div className={`absolute bg-light-main dark:bg-dark-main z-40 shadow-xl -top-0 max-lg:left-0 right-0 m-auto lg: lg:top-0 lg:right-0 rounded-xl lg:rounded-3xl transition-all p-3 tiny:p-5 w-fit overflow-hidden ${isOpen ? "min-w-[300px] w-[350px] min-h-[400px] max-lg:-translate-y-120 " : "p-0 max-w-0 max-h-0 opacity-0"}`}>
                <h2 className={"text-3xl font-medium"}>Add Asset</h2>
                <form onSubmit={handleSubmit} className={"text-xl w-full"}>
                    <select
                        name="type"
                        value={type}
                        className="w-full font-medium border-b-2 border-b-light-text-secondary dark:border-b-dark-text outline-none focus:scale-x-105 p-1 focus:bg-light-tertiary dark:focus:bg-dark-secondary"
                        required
                        onChange={ (e) => {
                            setType(e.target.value);
                            console.log(e.target.value);
                            setNotAddDataManually(typesWithTicker.includes(e.target.value));
                        }
                        }
                    >
                        <option value="" disabled>-- Select Asset Type --</option>
                        {assetTypes.map( (e,index) => {
                            return(
                                <option key={index} value={e.value}>{e.label}</option>
                            );
                        })}
                    </select>

                    {notAddDataManually ? (
                        <>
                            <section className={"flex my-3 relative w-full"}>
                                <input
                                    type={"text"}
                                    placeholder={"ticker"}
                                    name={"ticker"}
                                    required
                                    className={"w-full font-medium border-b-2 border-b-light-text-secondary dark:border-b-dark-text outline-none focus:scale-x-105 p-1 placeholder:text-light-text-secondary dark:placeholder:text-dark-text focus:placeholder:text-light-tertiary dark:focus:placeholder:text-dark-text-secondary"}/>
                            </section>
                            <section className={"flex my-3 relative w-full"}>
                                <input
                                    type={"number"}
                                    min={1}
                                    placeholder={"quantity"}
                                    required
                                    name={"quantity"}
                                    className={"w-full font-medium border-b-2 border-b-light-text-secondary dark:border-b-dark-text outline-none focus:scale-x-105 p-1 placeholder:text-light-text-secondary dark:placeholder:text-dark-text focus:placeholder:text-light-tertiary dark:focus:placeholder:text-dark-text-secondary"}/>
                            </section>
                            <section className={"flex my-3 relative w-full"}>
                                <select
                                    name="country"
                                    className="w-full font-medium border-b-2 border-b-light-text-secondary dark:border-b-dark-text outline-none focus:scale-x-105 p-1 focus:bg-light-tertiary dark:focus:bg-dark-secondary"
                                    size={1}
                                    required
                                    defaultValue=""
                                >
                                    <option value="" disabled>-- Select Country --</option>
                                    {countries.map((c,index) => (
                                        <option key={index} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </section>
                        </>
                    ) : type ? (
                        formAssets.map( (item,index) => {
                                return(
                                    ![ !typesWithTicker.includes(type) ? 0 : -1,!typesWithTicker.includes(type) ? 4 : -1].includes(index) ? (
                                        <section className={"flex my-3 relative w-full"} key={index}>
                                        {item.key === "currency" ? (
                                                <select
                                                    name={item.key}
                                                    className="w-full font-medium border-b-2 border-b-light-text-secondary dark:border-b-dark-text outline-none focus:scale-x-105 p-1 focus:bg-light-tertiary dark:focus:bg-dark-secondary"
                                                    required
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>
                                                        -- Select Currency --
                                                    </option>
                                                    {currencies.map( (c,index) => (
                                                        <option key={index} value={c.value}>{c.label}</option>
                                                    ))}
                                                </select>
                                        ) : (
                                                <input
                                                    type={item.type}
                                                    min={1}
                                                    placeholder={item.label}
                                                    name={item.key}
                                                    className={"w-full font-medium border-b-2 border-b-light-text-secondary dark:border-b-dark-text outline-none focus:scale-x-105 p-1 placeholder:text-light-text-secondary dark:placeholder:text-dark-text focus:placeholder:text-light-tertiary dark:focus:placeholder:text-dark-text-secondary"}/>
                                        )}
                                        </section>
                                    ) : null
                                );
                            })
                    ) : null}
                    {error && (
                        <p className={"font-medium my-3 text-light-error-text dark:text-dark-error-text"}>{error}</p>
                    )}
                    {isLoading ?
                        <FaSpinner className="animate-spin text-4xl mx-auto text-light-main dark:text-dark-main" />
                        : <input type="submit" value="Add Asset"
                                 className={"bg-light-secondary dark:bg-dark-secondary text-light-text-secondary dark:text-dark-text active:bg-light-active dark:active:bg-dark-active rounded-lg px-3 py-2 cursor-pointer transition-all hover:-translate-y-1"}/>
                    }
                </form>
            </div>
        </div>
    );
}