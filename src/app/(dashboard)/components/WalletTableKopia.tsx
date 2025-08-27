"use client";
import {FaSort, FaSpinner} from "react-icons/fa";
import AssetModifyMenu from "@/app/(dashboard)/components/AssetModifyMenu";
import {walletProps} from "@/types/wallet";
import {useState} from "react";
import {useRouter} from "next/navigation";

import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

export default function WalletTable({tableHeaders, sortConfig,isLoading,getPortfolioPercentage,handleSort,sortedFilteredAssets,error,getAssets}:walletProps){
    const [editingId, setEditingId] = useState<string |null >(null);
    const [editedValues,setEditedValues] = useState<any>({});
    const router = useRouter();

    const startEditing = (asset:any) =>{
        setEditingId(asset._id);
        setEditedValues(asset);
    }

    const cancelEditing = () =>{
        setEditingId(null);
        setEditedValues({});
    }

    const handleChange = (key:string, value:string | number) => {
        setEditedValues( (prev:any) => ({...prev, [key]: value}) );
    }

    const saveChanges = async () => {

        const res = await fetch("/api/user/assets", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({editedValues}),
        });

        const data = await res.json();

        if(!data.success){
            console.error(data.error);
        }
        router.refresh();
    };

    const editableInput = (key: string, value: string | number) => (
        <input
            className={`
      w-full py-1 px-2 text-center outline-none font-semibold rounded-md transition
      border-2 shadow-sm
      bg-light-bg text-light-text border-light-main
      focus:bg-light-bg-secondary focus:border-light-secondary
      dark:bg-dark-bg dark:text-dark-text dark:border-dark-main
      dark:focus:bg-dark-bg-secondary dark:focus:border-dark-secondary
      focus:shadow-[0_0_0_2px_var(--color-light-main)]
      dark:focus:shadow-[0_0_0_2px_var(--color-dark-main)]
      duration-150
    `}
            value={value}
            autoFocus
            onChange={e => handleChange(key, e.target.value)}
            style={{
                boxShadow: '0 1px 4px 0 rgba(168,130,221,0.13)',
            }}
        />
    );

    return(
        <main className={"bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text dark:text-dark-text w-full min-h-screen rounded-2xl shadow-sm tracking-tight overflow-hidden"}>
            <table className={"w-full px-2 border-separate border-spacing-x-"}>
                <thead className="w-full">
                <tr className="w-full cursor-default border-b-2 rounded-4xl border-light-main dark:border-dark-main">
                    {tableHeaders.map( (item,index) => {
                        return(
                            <th key={index} >
                                <div className={"flex items-center gap-1 justify-center text-lg my-2 font-medium"}>
                                    {item.label}
                                    <FaSort onClick={()=> handleSort(item.key)} className={"dark:text-dark-main cursor-pointer "} />
                                </div>
                            </th>
                        );
                    })}
                </tr>
                </thead>
                <tbody>
                {isLoading && (
                    <tr>
                        <td colSpan={tableHeaders.length} className="text-center py-10">
                            <FaSpinner className="animate-spin text-4xl mx-auto text-light-main dark:text-dark-main" />
                        </td>
                    </tr>
                )}
                {!isLoading && sortedFilteredAssets && (
                    sortedFilteredAssets.map((asset,index)=>{
                        const isEditing = asset._id === editingId;
                        return(
                            <tr
                                key={index}
                                className="cursor-default rounded-4xl text-center text-xl font-medium odd:bg-light-bg odd:dark:bg-dark-secondary text-light-text dark:text-dark-text">
                                {isEditing
                                    ? <td className={"p-1"}> {editableInput("ticker", editedValues.ticker)}</td>
                                    : <td className={"py-2"}>{asset.ticker}</td>}
                                {isEditing
                                    ? <td className={"p-1"}> {editableInput("type", editedValues.type)}</td>
                                    : <td className={"py-2"}>{asset.type}</td>}
                                {isEditing
                                    ? <td className={"p-1"}> {editableInput("name", editedValues.name)}</td>
                                    : <td className={"py-2"}>{asset.name}</td>}
                                {isEditing
                                    ? <td className={"p-1"}> {editableInput("quantity", editedValues.quantity)}</td>
                                    : <td className={"py-2"}>{asset.quantity}</td>}
                                {isEditing
                                    ? <td className={"p-1"}> {editableInput("purchaseUnitPrice", editedValues.purchaseUnitPrice)}</td>
                                    : <td className={"py-2"}>{asset.purchaseUnitPrice}</td>}
                                {isEditing
                                    ? <td className={"p-1 px-20"}>{asset.totalValue}</td>
                                    : <td className={"py-2"}>{asset.totalValue}</td>}
                                {isEditing
                                    ? <td className={"p-1"}> {editableInput("actualUnitPrice", editedValues.actualUnitPrice)}</td>
                                    : <td className={"py-2"}>{asset.actualUnitPrice}</td>}
                                {isEditing
                                    ? <td className={"p-1 px-20"}>{asset.actualTotalPrice}</td>
                                    : <td className={"py-2"}>{asset.actualTotalPrice}</td>}
                                {isEditing
                                    ? <td className={"p-1"}> {editableInput("currency", editedValues.currency)}</td>
                                    : <td className={"py-2"}>{asset.currency}</td>}
                                {isEditing
                                    ? <td className={"p-1 px-20"}>{asset.portfolioPercentage}</td>
                                    : <td className={"py-2"}>{asset.portfolioPercentage}</td>}
                                {isEditing
                                    ? <td className={"p-1 px-20"}>{asset.dailyChange}</td>
                                    : <td className={"py-2"}>{asset.dailyChange}</td>}
                                <td className={"py-1"}>
                                    {isEditing ? (
                                        <div className={"flex items-center justify-evenly gap-2 w-full px-2"}>
                                            <FaCheckCircle size={23} className={"text-green-500 cursor-pointer"} onClick={saveChanges}/>
                                            <MdCancel size={26} className={"text-light-error-text dark:text-dark-error-text cursor-pointer"} onClick={cancelEditing} />
                                        </div>
                                    ) : (
                                        <AssetModifyMenu id={asset._id}  refresh={getAssets} handleEdit={ () => startEditing(asset)}/>
                                    )}
                                </td>
                            </tr>
                        );
                    })
                )}
                {error && (
                    <tr>
                        <td colSpan={tableHeaders.length} className="text-center py-10 text-light-error-text dark:text-dark-error-text">
                            {error}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </main>
    );
}