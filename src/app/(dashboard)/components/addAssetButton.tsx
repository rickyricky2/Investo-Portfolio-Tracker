"use client"
import {FaPlus, FaSpinner} from "react-icons/fa";
import React, { useState,useEffect, useRef } from 'react';
import { useWalletStore } from "@/store/useWalletStore";
import {z} from "zod";
import {formAssets,typesWithTicker,countries, currencies, assetTypes} from "@/content/assetContent";
import {useNotification} from "./changeNotification";

let assetSchema;

const countryOptions = countries.map((c,index) => (
    <option key={index} value={c.name}>{c.name}</option>
));

const currencyOptions= currencies.map( (c,index) => (
    <option key={index} value={c.value}>{c.label}</option>
));

function AddAssetButtonComponent({mobile}: {mobile: boolean;}) {
    const [isOpen,setIsOpen]=useState(false);
    const [error, setError]=useState("");
    const [isLoading, setIsLoading]=useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { showNotification } = useNotification();

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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
                lastUnitPrice: Number(formData.get('lastUnitPrice') || formData.get('purchaseUnitPrice')),
                currency: formData.get('currency') as string,
                country: formData.get('country') as string || "",
                notAddedManually:  notAddDataManually,
                purchaseDate: formData.get("purchaseDate") as string,
            }

            // we add schema for validating this data
            assetSchema = z.object({
                ticker: z.string().optional(),
                type: z.string().min(1, "Asset type is required"),
                name: z.string().min(1,"Asset name is required"),
                quantity: z.number().min(1,"Quantity must be at least 1"),
                purchaseUnitPrice: z.coerce.number().positive("Unit price must be positive").refine( (val) => Number.isFinite(val), { message: `Invalid number, try typing with "." `}),
                lastUnitPrice: z.coerce.number().positive("Unit price must be positive").refine( (val) => Number.isFinite(val), { message: `Invalid number, try typing with "." `}),
                currency: z.string().min(1, "U must chose currency"),
                country: z.string().optional(),
                purchaseDate: z.string().refine( (val) => {
                    const inputDate = new Date(val);
                    inputDate.setHours(0,0,0,0);
                    return inputDate <= today;
                },{
                    message: "Date can not be in the future"
                }),
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
                purchaseDate: z.string().refine( (val) => {
                    const inputDate = new Date(val);
                    inputDate.setHours(0,0,0,0);
                    return inputDate <= today;
                },{
                    message: "Date can not be in the future"
                }),
            });
            //then we have to take some info from client.

            rawData = {
                type: type,
                ticker: formData.get("ticker") as string,
                country: formData.get("country") as string,
                quantity: Number(formData.get('quantity')),
                purchaseDate: formData.get("purchaseDate") as string,
            }
            const quantity = rawData.quantity;

            // then check if we have info about ticker in dataStore db and if ticker info is fresh

            const ticker = rawData.ticker as string;
            const country = rawData.country as string;

            let res = await fetch(`${baseURL}/api/dataStore?ticker=${encodeURIComponent(ticker)}&country=${country}`, {
                method:"GET",
                headers:{"Content-Type": "application/json"},
            });

            let data = await res.json();

            if(data.success){
            //     if we have this ticker data already stored

                const tickerData = data.tickerInfo;
                rawData = {
                    ...tickerData,
                    purchaseUnitPrice: tickerData.lastUnitPrice,
                    quantity,
                    country,
                    purchaseDate: rawData.purchaseDate,
                }
            }else {
                // if we don't have data stored for this ticker we have to call API

                // first we fetch for ticker data
                res = await fetch(`${baseURL}/api/stockMarketAPI?ticker=${ticker}&country=${country}`, {
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
                    dailyChange: Number(tickerInfo.change),
                    dailyChangePercent: Number(tickerInfo.percent_change),
                }

                //     if we successfully grabbed data from API we save this in dataStore for other users

                await fetch(`${baseURL}/api/dataStore`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({rawData}),
                })
            }
            const validateData = assetSchema.safeParse(rawData);

            if(!validateData.success){
                setError(validateData.error.errors[0].message);
                setIsLoading(false);
                return;
            }

            await fetch(`${baseURL}/api/historicalRates?purchaseDate=${rawData.purchaseDate}`, {
                method: "POST",
                headers:{"Content-Type": "application/json"},
            });

        }
        const res = await fetch(`${baseURL}/api/user/assets`,{
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({rawData, notAddDataManually}),
        });

        const data = await res.json();

        if(!data.success){
            setError("could not save data");
        }

        showNotification(`Asset has been added!`);
        triggerRefresh();
        setIsOpen(false);
        setIsLoading(false);
    }

    const [type, setType] = useState("");
    const [notAddDataManually,setNotAddDataManually] = useState(true);

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    return(
        <div className={`lg:relative text-light-text-secondary dark:text-dark-text`} ref={wrapperRef}>
            <div className={`${mobile ? "bg-transparent" : "bg-light-bg-tertiary dark:bg-dark-main"} transition-all rounded-full cursor-pointer p-1 z-100 relative group `}  >
                <FaPlus className={`${mobile ? "text-light-text-tertiary dark:text-dark-text-tertiary" : "text-light-text-secondary dark:text-dark-text" }   z-10 transition-all ${isOpen ? "rotate-45" : ""}`} size={30} onClick={() => setIsOpen(!isOpen)} />
                <p className={`${isOpen ? 'hidden' : "hidden lg:block"} absolute bottom-6 -left-7 group-hover:-translate-y-5 shadow-md rounded-md text-lg
                      w-25 p-2 scale-0 text-light-text-tertiary bg-[hsl(266,40%,85%)] dark:text-dark-text dark:bg-dark-secondary font-medium duration-175 overflow-hidden group-hover:scale-100 text-center
                `}>
                    Add Asset
                </p>
            </div>
            <div className={`fixed mx-auto bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-tertiary dark:text-dark-text-tertiary z-40 shadow-2xl max-lg:left-0 right-0 m-auto lg:top-0 lg:right-0 rounded-4xl lg:rounded-3xl transition-all p-5 tiny:p-5 max-h-[80%] lg:max-h-[710px] overflow-hidden min-w-[300px] lg:min-w-0 w-[330px] lg:absolute ${isOpen ? notAddDataManually ? "overflow-y-auto max-lg:bottom-20 lg:h-[420px]" : " overflow-y-auto max-lg:bottom-20 lg:h-[820px]" : "lg:w-0 lg:h-0 lg:opacity-0 max-lg:-bottom-[1000px]"}`}>
                <h2 className={"text-3xl my-2 font-medium text-light-secondary dark:text-dark-tertiary"}>Add Asset</h2>
                <form onSubmit={handleSubmit} className={"text-xl w-full"}>
                    <select
                        name="type"
                        value={type}
                        className="text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none appearance-none bg-transparent p-1 focus:bg-light-bg-tertiary dark:focus:bg-dark-bg-tertiary focus:border-b-light-text-tertiary dark:focus:border-b-dark-main"
                        required
                        onChange={ (e) => {
                            setType(e.target.value);
                            setNotAddDataManually(typesWithTicker.includes(e.target.value));
                        }}
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
                                    className={"text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none focus:scale-x-105 p-1 placeholder:text-[hsl(266,40%,70%)] dark:placeholder:text-dark-text-tertiary  dark:focus:placeholder:text-dark-text-secondary"}/>
                            </section>
                            <section className={"flex my-3 relative w-full"}>
                                <input
                                    type={"number"}
                                    min={1}
                                    placeholder={"quantity"}
                                    required
                                    name={"quantity"}
                                    className={"text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none focus:scale-x-105 p-1 placeholder:text-[hsl(266,40%,70%)] dark:placeholder:text-dark-text-tertiary  dark:focus:placeholder:text-dark-text-secondary"}/>
                            </section>
                            <section className={"flex my-3 relative w-full"}>
                                <select
                                    name="country"
                                    className="text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none appearance-none bg-transparent p-1 focus:bg-light-bg-tertiary dark:focus:bg-dark-bg-tertiary focus:border-b-light-text-tertiary dark:focus:border-b-dark-main"
                                    size={1}
                                    required
                                    defaultValue=""
                                >
                                    <option value="" disabled>-- Select Country --</option>
                                    {countryOptions}
                                </select>
                            </section>
                            <section className={"flex my-3 relative w-full"}>
                                <input
                                    type={"date"}
                                    min={1}
                                    placeholder={"Purchase Date"}
                                    defaultValue={formattedDate}
                                    required
                                    name={"purchaseDate"}
                                    className={"text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none focus:scale-x-105 p-1 placeholder:text-[hsl(266,40%,70%)] dark:placeholder:text-dark-text-tertiary  dark:focus:placeholder:text-dark-text-secondary"}/>
                            </section>
                        </>
                    ) : type ? (
                        formAssets.map( (item,index) => {
                                return(
                                    ![ !typesWithTicker.includes(type) ? 0 : -1,!typesWithTicker.includes(type) ? 4 : -1].includes(index) ? (
                                        <section className={"flex my-3 relative w-full "} key={index}>
                                        {item.key === "currency" ? (
                                                <select
                                                    name={item.key}
                                                    className="text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none appearance-none bg-transparent p-1 focus:bg-light-bg-tertiary dark:focus:bg-dark-bg-tertiary focus:border-b-light-text-tertiary dark:focus:border-b-dark-main"
                                                    required
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>
                                                        -- Select Currency --
                                                    </option>
                                                    {currencyOptions}
                                                </select>
                                        ) : item.key === "country" ? (
                                            <select
                                                name="country"
                                                className="text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none appearance-none bg-transparent p-1 focus:bg-light-bg-tertiary dark:focus:bg-dark-bg-tertiary focus:border-b-light-text-tertiary dark:focus:border-b-dark-main"
                                                size={1}
                                                required
                                                defaultValue=""
                                            >
                                                <option value="" disabled>-- Select Country --</option>
                                                {countryOptions}
                                            </select>
                                        ) : item.key === "purchaseDate" ? (
                                            <section className={"flex my-3 relative w-full"}>
                                                <input
                                                    type={"date"}
                                                    min={1}
                                                    placeholder={"Purchase Date"}
                                                    defaultValue={formattedDate}
                                                    required
                                                    name={"purchaseDate"}
                                                    className={"text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none focus:scale-x-105 p-1 placeholder:text-[hsl(266,40%,70%)] dark:placeholder:text-dark-text-tertiary  dark:focus:placeholder:text-dark-text-secondary"}/>
                                            </section>
                                        ) : (
                                            <input
                                                min={1}
                                                placeholder={item.label}
                                                name={item.key}
                                                className={"text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none focus:scale-x-105 p-1 placeholder:text-[hsl(266,40%,70%)] dark:placeholder:text-dark-text-tertiary  dark:focus:placeholder:text-dark-text-secondary"}/>
                                        )}
                                        </section>
                                    ) : null
                                );
                            })
                    ) : null}
                    {error && (
                        <p className={"font-medium my-3 text-light-error-text dark:text-dark-error-text"}>{error}</p>
                    )}
                    <div className={"flex justify-center items-center"}>
                    {isLoading ?
                        <FaSpinner className="animate-spin text-4xl mx-auto text-light-main dark:text-dark-main" />
                        : <input type="submit" value="Add Asset"
                                 className={"bg-light-secondary mt-5 dark:bg-dark-main font-medium text-light-text-secondary dark:text-dark-text-secondary active:bg-light-active dark:active:bg-dark-active rounded-2xl px-7 py-3 cursor-pointer transition-all hover:-translate-y-1"}/>
                    }
                    </div>
                </form>
            </div>
        </div>
    );
}

const AddAssetButton = React.memo(AddAssetButtonComponent);

export default AddAssetButton;