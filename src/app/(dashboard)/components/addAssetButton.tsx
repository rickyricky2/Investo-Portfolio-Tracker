"use client"
import { FaPlus } from "react-icons/fa";
import { useState,useEffect, useRef } from 'react';
import {z} from "zod";

const assetSchema = z.object({
    type: z.string().min(1, "Asset type is required"),
    name: z.string().min(1,"Asset name is required"),
    symbol: z.string().optional(),
    quantity: z.number().min(1,"Quantity must be at least 1"),
    unitPrice: z.number().positive("Unit price must be positive"),
    currency: z.string().min(1, "u must chose currency"),
});

const formAssets: {label:string, key:string, type:string}[] = [
    { label:"Type", key:"type", type:"text" },
    { label:"Name", key:"name", type:"text" },
    { label:"Symbol", key:"symbol", type:"text" },
    { label:"Quantity", key:"quantity", type:"number" },
    { label:"Unit Price", key:"unitPrice", type:"number" },
    { label:"Currency", key:"currency", type:"text" },
];

export default function AddAssetButton({onAdded}:{onAdded: () => void }){
    const [isOpen,setIsOpen]=useState(false);
    const [error, setError]=useState("");
    const [loading, setLoading]=useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

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
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const rawData = {
            type: formData.get('type') as string,
            name: formData.get('name') as string,
            symbol: formData.get('symbol') as string,
            quantity: Number(formData.get('quantity')),
            unitPrice: Number(formData.get('unitPrice')),
            currency: formData.get('currency') as string,
        }

        const validateData = assetSchema.safeParse(rawData);

        if(!validateData.success){
            console.log(1);
            setError(validateData.error.errors[0].message);
            return;
        }

        const res = await fetch("/api/user/assets",{
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({rawData}),
        });

        const data = await res.json();

        if(!data.success){
            setError(data?.error);
        }

        onAdded();
        setIsOpen(false);
    }

    return(
        <div className={`relative text-light-text-secondary dark:text-dark-text`} ref={wrapperRef}>
            <div className={`bg-light-main dark:bg-dark-main transition-all rounded-full p-1 z-20 relative group `}  >
                <FaPlus className={`text-light-text-secondary dark:text-dark-text z-20 transition-all ${isOpen ? "rotate-45" : ""}`} size={30} onClick={() => setIsOpen(!isOpen)} />
                <p className={`${isOpen && 'hidden'} absolute bottom-6 -left-7 group-hover:-translate-y-5 shadow-md rounded-md text-lg
                      w-25 p-2 scale-0 text-light-text bg-light-text-secondary dark:text-dark-text dark:bg-dark-secondary font-medium duration-175 overflow-hidden group-hover:scale-100 text-center
                `}>
                    Add Asset
                </p>
            </div>
            <div className={`absolute bg-light-main dark:bg-dark-main z-10 shadow-xl top-0 right-0 rounded-3xl transition-all p-5 overflow-hidden ${isOpen ? "min-w-[300px] w-[350px] max-h-[500px]" : "max-w-0 max-h-0 opacity-0"}`}>
                <h2 className={"text-3xl font-medium"}>Add Asset</h2>
                <form onSubmit={handleSubmit} className={"text-xl w-full"}>
                    {formAssets.map( (item,index) => {
                        return(
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
                                        <option value="USD">USD – US Dollar</option>
                                        <option value="EUR">EUR – Euro</option>
                                        <option value="GBP">GBP – British Pound</option>
                                        <option value="CHF">CHF – Swiss Franc</option>
                                        <option value="JPY">JPY – Japanese Yen</option>
                                        <option value="PLN">PLN – Polish Zloty</option>
                                        <option value="CAD">CAD – Canadian Dollar</option>
                                        <option value="AUD">AUD – Australian Dollar</option>
                                        <option value="CNY">CNY – Chinese Yuan</option>
                                        <option value="NZD">NZD – New Zealand Dollar</option>
                                        <option value="SEK">SEK – Swedish Krona</option>
                                        <option value="NOK">NOK – Norwegian Krone</option>
                                        <option value="MXN">MXN – Mexican Peso</option>
                                        <option value="SGD">SGD – Singapore Dollar</option>
                                        <option value="HKD">HKD – Hong Kong Dollar</option>
                                        <option value="KRW">KRW – South Korean Won</option>
                                    </select>
                                ) : (
                                    item.key === "type" ? (
                                        <select
                                            name="type"
                                            className="w-full font-medium border-b-2 border-b-light-text-secondary dark:border-b-dark-text outline-none focus:scale-x-105 p-1 focus:bg-light-tertiary dark:focus:bg-dark-secondary"
                                            required
                                            defaultValue=""
                                        >
                                            <option value="" disabled>-- Select Asset Type --</option>
                                            <option value="stock">Stock</option>
                                            <option value="bond">Bond</option>
                                            <option value="mutual_fund">Mutual Fund</option>
                                            <option value="etf">ETF (Exchange-Traded Fund)</option>
                                            <option value="real_estate">Real Estate</option>
                                            <option value="crypto">Cryptocurrency</option>
                                            <option value="commodity">Commodity</option>
                                            <option value="cash">Cash</option>
                                            <option value="private_equity">Private Equity</option>
                                            <option value="hedge_fund">Hedge Fund</option>
                                            <option value="collectibles">Collectibles (Art, Antiques)</option>
                                            <option value="forex">Forex (Foreign Exchange)</option>
                                            <option value="infrastructure">Infrastructure</option>
                                            <option value="venture_capital">Venture Capital</option>
                                            <option value="precious_metals">Precious Metals (Gold, Silver)</option>
                                            <option value="insurance_contracts">Insurance Contracts</option>
                                            <option value="structured_products">Structured Products</option>
                                            <option value="debt_instruments">Debt Instruments</option>
                                            <option value="royalties">Royalties</option>
                                            <option value="other">Other</option>
                                        </select>
                                        ) : (
                                                <input
                                                    type={item.type}
                                                    min={1}
                                                    placeholder={item.label}
                                                    name={item.key}
                                                    className={"w-full font-medium border-b-2 border-b-light-text-secondary dark:border-b-dark-text outline-none focus:scale-x-105 p-1 placeholder:text-light-text-secondary dark:placeholder:text-dark-text focus:placeholder:text-light-tertiary dark:focus:placeholder:text-dark-text-secondary"}/>
                                    ))}
                            </section>
                        );
                    })}
                    {error && (
                        <p className={"font-medium my-3 text-light-error-text dark:text-dark-error-text"}>{error}</p>
                    )}
                    <input type="submit" value="Add Asset"
                    className={"bg-light-secondary dark:bg-dark-secondary text-light-text-secondary dark:text-dark-text active:bg-light-active dark:active:bg-dark-active rounded-lg px-3 py-2 cursor-pointer transition-all hover:-translate-y-1"}/>
                </form>
            </div>
        </div>
    );
}