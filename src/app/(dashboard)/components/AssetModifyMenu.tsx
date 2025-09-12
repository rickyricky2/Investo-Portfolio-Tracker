"use client";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { GoAlertFill } from "react-icons/go";
import React from "react";

export default function AssetModifyMenu({id,refresh,showNotification, handleEdit,ticker,country,purchaseDate,quantity,purchasePrice,currency}: {id: string;refresh: () => void;showNotification: (message?: string) => void; handleEdit: (id:string) => void;ticker?:string;country:string;purchaseDate:string;quantity:number;purchasePrice?:number;currency:string;}) {
    const handleDelete = async (id:string) =>{

        const res = await fetch("/api/user/assets",{
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id}),
        });

        const data = await res.json();

        if(!data.success){
            console.error(data?.error);
        }
        showNotification("Asset have been deleted!");
        refresh();
    }
    const handlePermanentDelete = async () =>{

        const url = `/api/user/walletSnapshots?ticker=${ticker}&delete=true&country=${country}&purchaseDate=${purchaseDate}&quantity=${quantity}&price=${purchasePrice}&currency=${currency}`;
        const res = await fetch(url,{
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if(!data.success){
            console.error(data?.error);
        }
    }

    return(
        <div className="flex items-center justify-evenly flex-wrap gap-2 w-full px-2">
            <div className={"cursor-pointer relative group"}>
                <IoPencil  className={"text-light-tertiary dark:text-dark-text cursor-pointer"} onClick={() => handleEdit(id)} size={20} />
                <p className={`absolute bottom-3 -left-5 group-hover:-translate-y-5 shadow-md rounded-md text-lg
                      w-15 p-2 scale-0 text-light-text-secondary bg-light-main dark:text-dark-text dark:bg-dark-main font-medium duration-55 overflow-hidden group-hover:scale-100 text-center
                `}>
                    Edit
                </p>
            </div>
            <div className={"cursor-pointer relative group"}>
                <FaRegTrashAlt className={"text-light-error-text dark:text-dark-error-text cursor-pointer"} onClick={() => handleDelete(id)} size={20} />
                <p className={`absolute bottom-3 -left-8 group-hover:-translate-y-5 shadow-md rounded-md text-lg
                      w-20 p-2 scale-0 text-light-text-secondary bg-light-main dark:text-dark-text dark:bg-dark-main font-medium duration-55 overflow-hidden group-hover:scale-100 text-center
                `}>
                    Delete
                </p>
            </div>
            <div className={"cursor-pointer relative group"}>
                <GoAlertFill className={"text-light-error-text dark:text-dark-error-text cursor-pointer"} onClick={() => {
                                                                                                                                    handleDelete(id);
                                                                                                                                    handlePermanentDelete();
                                                                                                                                   }} size={20} />
                <p className={`absolute bottom-3 -left-40 group-hover:-translate-y-5 shadow-md rounded-md text-lg
                      w-50 p-2 scale-0 text-light-text-secondary bg-light-main dark:text-dark-text dark:bg-dark-main font-medium duration-55 overflow-hidden group-hover:scale-100 text-center
                `}>
                    Delete from portfolio & history ⚠️
                </p>
            </div>
        </div>
    );
}