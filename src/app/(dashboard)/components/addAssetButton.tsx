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

export async function updateWalletSnapshots(baseURL:string,country:string,purchaseDate:string,quantity:number,currency:string,today:string,addedManually:boolean,ticker?:string,price?:number,ifDelete:boolean = false,) {
    try {
        const url = `${baseURL}/api/user/walletSnapshots?ticker=${ticker}&country=${country}&purchaseDate=${purchaseDate}&quantity=${quantity}&addedManually=${addedManually}&price=${price}&today=${today}&currency=${currency}&delete=${ifDelete}`;
        const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" } });
        const data = await res.json();
        if(data.success){
            console.log("Wallet Snapshot Update Response:", data.success);
        }else{
            console.warn("Error:", data.error);
        }
    } catch (err:unknown) {
        console.warn("Error:", err);
    }
}

function AddAssetButtonComponent({mobile}: {mobile: boolean;}) {
    const [isOpen,setIsOpen]=useState(false);
    const [error, setError]=useState("");
    const [isLoading, setIsLoading]=useState(false);
    const [purchaseUnitPriceState, setPurchaseUnitPriceState] = useState<string | number>("");
    const [lastUnitPriceState, setLastUnitPriceState] = useState<string | number>("");

    const [tickerState, setTickerState] = useState("");
    const [countryState, setCountryState] = useState("");
    const [purchaseDateState, setPurchaseDateState] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const [today, setToday] = useState("");

    const wrapperRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);


    const { showNotification } = useNotification();

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const triggerRefresh = useWalletStore((state) => state.triggerRefresh);

    useEffect(() => {
        if(!isOpen) return;

        function handleClickOutside(event: Event) {
            const clickedAllowed =
                (wrapperRef.current && wrapperRef.current.contains(event.target as Node)) ||
                (buttonRef.current && buttonRef.current.contains(event.target as Node));

            if (!clickedAllowed) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener('pointerdown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener('pointerdown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);


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
                type: z.string({
                    required_error: "Asset type is required",
                    invalid_type_error: "Asset type must be text",
                }).min(1, "Asset type is required"),
                name: z.string({
                    required_error: "Asset name is required",
                    invalid_type_error: "Asset name must be a text",
                }).min(1,"Asset name is required"),
                quantity: z.coerce.number({
                    required_error: "Quantity is required",
                    invalid_type_error: "Quantity must be a number",
                }).min(1,"Quantity must be at least 1"),
                purchaseUnitPrice: z.coerce.number({
                    required_error: "Purchase unit price is required",
                    invalid_type_error: "Purchase unit price must be a number",
                }).positive("Unit price must be positive").refine( (val) => Number.isFinite(val), { message: `Invalid number, try typing with "." `}),
                lastUnitPrice: z.coerce.number({
                    required_error: "Last unit price is required",
                    invalid_type_error: "Last unit price must be a number",
                }).positive("Unit price must be positive").refine( (val) => Number.isFinite(val), { message: `Invalid number, try typing with "." `}),
                currency: z.string({
                    required_error: "Currency is required",
                    invalid_type_error: "Currency must be a text",
                }).min(1, "U must chose currency"),
                country: z.string({
                    required_error: "Country is required",
                    invalid_type_error: "Country must be a text",
                }).optional(),
                purchaseDate: z.string({
                    required_error: "Purchase Date is required",
                    invalid_type_error: "Purchase Date must be a date",
                }).refine( (val) => {
                    const inputDate = new Date(val);
                    inputDate.setHours(0,0,0,0);
                    return inputDate <= new Date();
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
                ticker: z.string().optional(),
                type: z.string({
                    required_error: "Asset type is required",
                    invalid_type_error: "Asset type must be text",
                }).min(1, "Asset type is required"),
                name: z.string({
                    required_error: "Asset name is required",
                    invalid_type_error: "Asset name must be a text",
                }).min(1,"Asset name is required"),
                quantity: z.coerce.number({
                    required_error: "Quantity is required",
                    invalid_type_error: "Quantity must be a number",
                }).min(1,"Quantity must be at least 1"),
                purchaseUnitPrice: z.coerce.number({
                    required_error: "Purchase unit price is required",
                    invalid_type_error: "Purchase unit price must be a number",
                }).positive("Unit price must be positive").refine( (val) => Number.isFinite(val), { message: `Invalid number, try typing with "." `}),
                lastUnitPrice: z.coerce.number({
                    required_error: "Last unit price is required",
                    invalid_type_error: "Last unit price must be a number",
                }).positive("Unit price must be positive").refine( (val) => Number.isFinite(val), { message: `Invalid number, try typing with "." `}),
                currency: z.string({
                    required_error: "Currency is required",
                    invalid_type_error: "Currency must be a text",
                }).min(1, "U must chose currency"),
                country: z.string({
                    required_error: "Country is required",
                    invalid_type_error: "Country must be a text",
                }).optional(),
                purchaseDate: z.string({
                    required_error: "Purchase Date is required",
                    invalid_type_error: "Purchase Date must be a date",
                }).refine( (val) => {
                    const inputDate = new Date(val);
                    inputDate.setHours(0,0,0,0);
                    return inputDate <= new Date();
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
                purchaseUnitPrice: Number(formData.get('purchaseUnitPrice')),
                purchaseDate: formData.get("purchaseDate") as string,
            }
            const quantity = rawData.quantity;

            // then check if we have info about ticker in dataStore db and if ticker info is fresh

            const ticker = rawData.ticker as string;
            const country = rawData.country as string;

            const res = await fetch(`${baseURL}/api/dataStore?ticker=${ticker}&country=${country}`, {
                method:"GET",
                headers:{"Content-Type": "application/json"},
            });

            const data = await res.json();

            if(data.success){
            //     if we have this ticker data already stored
                const tickerData = data.tickerInfo;
                rawData = {
                    ...tickerData,
                    purchaseUnitPrice: Number(rawData.purchaseUnitPrice || tickerData.lastUnitPrice),
                    quantity,
                    country,
                    purchaseDate: rawData.purchaseDate,
                }
            }else {
                // if we don't have data stored for this ticker we have to call API

                // first we fetch for ticker data
                const res = await fetch(`${baseURL}/api/stockMarketAPI?ticker=${ticker}&country=${country}`, {
                    method: "GET",
                    headers:{"Content-Type": "application/json"},
                });
                const data = await res.json();

                if(!data.success){
                    setError("We couldn't find ticker info, u need to add information manually");
                    setIsLoading(false);
                    setNotAddDataManually(false);
                    // if(purchaseUnitPrice.success){
                    //     setPurchaseUnitPriceState(Number(purchaseUnitPrice.price));
                        const res = await fetch(`${baseURL}/api/stockMarketAPI?dataType=lastPrice&ticker=${ticker}&country=${country}`, {
                            method: "GET",
                            headers:{"Content-Type": "application/json"},
                        });
                        const data = await res.json();
                        if(data.success){
                            console.log(1);
                            setLastUnitPriceState(Number(data.lastPrice));
                        }else{
                            console.log(1);
                            setLastUnitPriceState("");
                        }
                    // }
                    return;
                }

                const tickerInfo = data.tickerInfo;
                const lastUnitPrice = Number(tickerInfo.close).toFixed(2);

                const currency = String(rawData.type).trim() === "crypto" ? String(tickerInfo.symbol).slice(-3) : tickerInfo.currency;

                rawData = {
                    ...rawData,
                    name:tickerInfo.name,
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
        updateWalletSnapshots(baseURL,rawData.country,rawData.purchaseDate,rawData.quantity,rawData.currency,today,!notAddDataManually,rawData.ticker,rawData.purchaseUnitPrice).catch(console.error);
        triggerRefresh();
        setIsOpen(false);
        setIsLoading(false);
    }

    useEffect( () => {
        if(isDirty) return;
        if(!tickerState || !countryState || !purchaseDateState) return;

        const timeout = setTimeout( async () => {
            const purchaseUnitPriceRes  = await fetch(`${baseURL}/api/stockMarketAPI?dataType=historicalPrices&ticker=${tickerState}&country=${countryState}&purchaseDate=${purchaseDateState}`, {
                method: "GET",
                headers:{"Content-Type": "application/json"},
            });
            if(purchaseUnitPriceRes.ok){
                const purchaseUnitPrice = await purchaseUnitPriceRes.json();
                if(purchaseUnitPrice.success){
                    setPurchaseUnitPriceState(purchaseUnitPrice.price);
                }
            }else{
                const purchaseUnitPriceRes  = await fetch(`${baseURL}/api/stockMarketAPI?dataType=lastPrice&ticker=${tickerState}&country=${countryState}`, {
                    method: "GET",
                    headers:{"Content-Type": "application/json"},
                });
                const purchaseUnitPrice = await purchaseUnitPriceRes.json();
                if(purchaseUnitPrice.success){
                    setPurchaseUnitPriceState(purchaseUnitPrice.lastPrice);
                }
            }
        }, 500);

        return () => clearTimeout(timeout);
    },[tickerState, countryState, purchaseDateState])

    const [type, setType] = useState("");
    const [quantityState, setQuantityState] = useState(0);
    const [notAddDataManually,setNotAddDataManually] = useState(true);

    useEffect( () => {
        const todayDate = new Date();
        const formattedDate = todayDate.toLocaleDateString("sv-SE");
        setToday(formattedDate);
        setPurchaseDateState(formattedDate);
    },[]);

    return(
        <div className={`lg:relative text-light-text-secondary dark:text-dark-text`}>
            <div ref={buttonRef} className={`${mobile ? "bg-transparent" : "bg-light-bg-tertiary dark:bg-dark-main"} transition-all rounded-full cursor-pointer p-1 z-100 relative group `}  >
                <FaPlus className={`${mobile ? "text-light-text-tertiary dark:text-dark-text-tertiary" : "text-light-text-secondary dark:text-dark-text" }   z-10 transition-all ${isOpen ? "rotate-45" : ""}`} size={30} onClick={() => setIsOpen(!isOpen)} />
                <p className={`${isOpen ? 'hidden' : "hidden lg:block"} absolute bottom-6 -left-7 group-hover:-translate-y-5 shadow-md rounded-md text-lg
                      w-25 p-2 scale-0 text-light-text-tertiary bg-[hsl(266,40%,85%)] dark:text-dark-text dark:bg-dark-secondary font-medium duration-175 overflow-hidden group-hover:scale-100 text-center
                `}>
                    Add Asset
                </p>
            </div>
            {mobile ? <div className={`fixed top-0 left-0 w-screen h-full backdrop-blur-lg transition-all ${isOpen ? "max-lg:scale-100" : "max-lg:scale-0"}`}></div> : null}
            <div ref={wrapperRef} className={`fixed mx-auto bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-tertiary dark:text-dark-text-tertiary z-40 shadow-2xl rounded-4xl lg:rounded-3xl transition-all p-5 tiny:p-5 right-5 max-lg:left-5 bottom-30 max-w-[330px] h-auto max-h-[500px] overflow-auto lg:absolute lg:right-0 lg:top-0 lg:w-[330px] lg:h-[500px] lg:max-h-[710px] ${isOpen ? "scale-100" : "scale-0 lg:translate-x-50 lg:-translate-y-70 opacity-0 appearance-none"}`}>
                <h2 className={"text-3xl my-2 font-medium text-light-secondary dark:text-dark-tertiary"}>Add Asset</h2>
                <form onSubmit={handleSubmit} className={"text-xl w-full relative"}>
                    <label htmlFor="type-select" className="sr-only">
                        Choose Type Of Asset
                    </label>
                    <span className={`absolute z-0 w-auto font-medium transition-all ${type ? "text-[.9rem] left-0 -top-[9px]" : "top-1 left-1 opacity-0"}`}>Type</span>
                    <select
                        name="type"
                        id={"type-select"}
                        value={type}
                        className="text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none appearance-none bg-transparent p-1 focus:bg-light-bg-tertiary dark:focus:bg-dark-bg-tertiary focus:border-b-light-text-tertiary dark:focus:border-b-dark-main"
                        required
                        onChange={ (e) => {
                            setType(e.target.value);
                            setNotAddDataManually(typesWithTicker.includes(e.target.value));
                            setError("");
                            setIsDirty(false);
                            setTickerState("");
                            setCountryState("");
                            setPurchaseUnitPriceState("");
                            setLastUnitPriceState("");
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
                                <span className={`absolute z-0 w-auto font-medium transition-all ${tickerState ? "text-[.9rem] left-0 -top-[7px]" : "top-1 left-1"}`}>Ticker</span>
                                <input
                                    type={"text"}
                                    name={"ticker"}
                                    required
                                    onChange={ (e) => setTickerState(e.target.value) }
                                    className={"text-dark-tertiary w-full z-10 font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none focus:scale-x-105 p-1 placeholder:text-[hsl(266,40%,70%)] dark:placeholder:text-dark-text-tertiary  dark:focus:placeholder:text-dark-text-secondary"}/>
                            </section>
                            <section className={"flex my-3 relative w-full"}>
                                <span className={`absolute z-0 w-auto font-medium transition-all ${quantityState ? "text-[.9rem] left-0 -top-[7px]" : "top-1 left-1"}`}>Quantity</span>
                                <input
                                    type={"number"}
                                    min={1}
                                    onChange={(e) => setQuantityState(Number(e.target.value))}
                                    required
                                    name={"quantity"}
                                    className={"text-dark-tertiary w-full z-10 font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none focus:scale-x-105 p-1 placeholder:text-[hsl(266,40%,70%)] dark:placeholder:text-dark-text-tertiary  dark:focus:placeholder:text-dark-text-secondary"}/>
                            </section>
                            <section className={"flex my-3 relative w-full"}>
                                <span className={`absolute z-0 w-auto font-medium transition-all ${purchaseUnitPriceState ? "text-[.9rem] left-0 -top-[7px]" : "top-1 left-1"}`}>Purchase Unit Price</span>
                                <input
                                    type={"number"}
                                    value={purchaseUnitPriceState === "" ? "" : purchaseUnitPriceState}
                                    onChange={ (e) => {
                                        setIsDirty(true);
                                        setPurchaseUnitPriceState(e.target.value);
                                    }}
                                    required={true}
                                    name={"purchaseUnitPrice"}
                                    className={"text-dark-tertiary w-full z-10 font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none focus:scale-x-105 p-1 placeholder:text-[hsl(266,40%,70%)] dark:placeholder:text-dark-text-tertiary  dark:focus:placeholder:text-dark-text-secondary"}/>
                            </section>
                            <section className={"flex my-3 relative w-full"}>
                                <label htmlFor="country-select" className="sr-only">
                                    Choose country
                                </label>
                                <span className={`absolute z-0 w-auto font-medium transition-all ${countryState ? "text-[.9rem] left-0 -top-[7px]" : "top-1 left-1 opacity-0"}`}>Country</span>

                                <select
                                    id={"country-select"}
                                    name="country"
                                    className="text-dark-tertiary w-full z-10 font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none appearance-none bg-transparent p-1 focus:bg-light-bg-tertiary dark:focus:bg-dark-bg-tertiary focus:border-b-light-text-tertiary dark:focus:border-b-dark-main"
                                    size={1}
                                    required
                                    onChange={ (e) => setCountryState(e.target.value) }
                                    defaultValue=""
                                >
                                    <option value="" disabled>-- Select Country --</option>
                                    {countryOptions}
                                </select>
                            </section>
                            <section className={"flex my-3 relative w-full"}>
                                <span className={`absolute z-0 w-auto font-medium transition-all ${purchaseDateState ? "text-[.9rem] left-0 -top-[7px]" : "top-1 left-1"}`}>Purchase Date</span>
                                <input
                                    type={"date"}
                                    min={1}
                                    placeholder={"Purchase Date"}
                                    onChange={ (e) => setPurchaseDateState(e.target.value) }
                                    defaultValue={today}
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
                                            <div>
                                                <label htmlFor="currency-select" className="sr-only">
                                                    Choose Currency
                                                </label>
                                                <select
                                                    name={item.key}
                                                    id={"currency-select"}
                                                    className="text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none appearance-none bg-transparent p-1 focus:bg-light-bg-tertiary dark:focus:bg-dark-bg-tertiary focus:border-b-light-text-tertiary dark:focus:border-b-dark-main"
                                                    required
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>
                                                        -- Select Currency --
                                                    </option>
                                                    {currencyOptions}
                                                </select>
                                            </div>
                                        ) : item.key === "country" ? (
                                            <div>
                                                <label htmlFor="country-select" className="sr-only">
                                                    Choose Country
                                                </label>
                                                <select
                                                    name="country"
                                                    id={"country-select"}
                                                    className="text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none appearance-none bg-transparent p-1 focus:bg-light-bg-tertiary dark:focus:bg-dark-bg-tertiary focus:border-b-light-text-tertiary dark:focus:border-b-dark-main"
                                                    size={1}
                                                    required
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>-- Select Country --</option>
                                                    {countryOptions}
                                                </select>
                                            </div>
                                        ) : item.key === "purchaseDate" ? (
                                            <section className={"flex my-3 relative w-full"}>
                                                <input
                                                    type={"date"}
                                                    min={1}
                                                    placeholder={"Purchase Date"}
                                                    defaultValue={purchaseDateState}
                                                    required
                                                    name={"purchaseDate"}
                                                    className={"text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none focus:scale-x-105 p-1 placeholder:text-[hsl(266,40%,70%)] dark:placeholder:text-dark-text-tertiary  dark:focus:placeholder:text-dark-text-secondary"}/>
                                            </section>
                                        ) : item.key === "purchaseUnitPrice" ? (
                                            <input
                                                min={1}
                                                placeholder={item.label}
                                                name={item.key}
                                                required={true}
                                                value={purchaseUnitPriceState}
                                                onChange={(e) => setPurchaseUnitPriceState(Number(e.target.value))}
                                                className={"text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none focus:scale-x-105 p-1 placeholder:text-[hsl(266,40%,70%)] dark:placeholder:text-dark-text-tertiary  dark:focus:placeholder:text-dark-text-secondary"}/>
                                        ) : item.key === "lastUnitPrice" ? (
                                            <input
                                                min={1}
                                                placeholder={item.label}
                                                name={item.key}
                                                required={true}
                                                value={lastUnitPriceState}
                                                onChange={(e) => setLastUnitPriceState(Number(e.target.value))}
                                                className={"text-dark-tertiary w-full font-medium border-b-2 border-b-light-text-tertiary dark:border-b-dark-tertiary outline-none focus:scale-x-105 p-1 placeholder:text-[hsl(266,40%,70%)] dark:placeholder:text-dark-text-tertiary  dark:focus:placeholder:text-dark-text-secondary"}/>
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