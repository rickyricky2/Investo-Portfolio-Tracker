"use client";
import { FaRegTrashAlt } from "react-icons/fa";
import {useRouter} from "next/navigation";

export default function AssetModifyMenu({id}: {id: string}) {
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
        router.refresh();
    }

    return(
        <div>
            <FaRegTrashAlt className={"text-red-600 cursor-pointer"} onClick={() => handleDelete(id)} size={20} />
        </div>
    );
}