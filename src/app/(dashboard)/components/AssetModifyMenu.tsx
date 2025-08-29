"use client";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";

export default function AssetModifyMenu({id,refresh, handleEdit}: {id: string;refresh: () => void; handleEdit: (id:string) => void}) {
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
        refresh();
    }

    return(
        <div className="flex items-center justify-evenly gap-2 w-full px-2">
            <IoPencil  className={"text-light-tertiary dark:text-dark-text cursor-pointer"} onClick={() => handleEdit(id)} size={20} />
            <FaRegTrashAlt className={"text-light-error-text dark:text-dark-error-text cursor-pointer"} onClick={() => handleDelete(id)} size={20} />
        </div>
    );
}