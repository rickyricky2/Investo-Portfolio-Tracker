"use client";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import {useRouter} from "next/navigation";

export default function AssetModifyMenu({id,refresh}: {id: string;refresh: () => void}) {
    const router = useRouter();
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
    const handleUpdate = async (id:string) =>{

        const res = await fetch("/api/user/assets",{
            method: "PUT",
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
        <div className="flex items-center justify-evenly gap-2 w-full">
            <IoPencil  className={"text-blue-600 cursor-pointer"} onClick={() => handleUpdate} size={20} />
            <FaRegTrashAlt className={"text-red-600 cursor-pointer"} onClick={() => handleDelete(id)} size={20} />
        </div>
    );
}