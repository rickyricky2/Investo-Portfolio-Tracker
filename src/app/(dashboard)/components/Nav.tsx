"use client";
import Link from "next/link";
import { MdSpaceDashboard } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { IoMdWallet } from "react-icons/io";

import { useState,useEffect } from 'react';

// icons

import { TbReportSearch } from "react-icons/tb";
import { IoLogoBuffer } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";

const menuItems = [
    {
        icons: <MdSpaceDashboard className="text-white" size={30} />,
        label: 'Dashboard',
        url: `/{userId}`
    },
    {
        icons: <IoMdWallet size={30} />,
        label: 'Wallet',
        url: `/{userId}/wallet`
    },
    {
        icons: <MdOutlineDashboard size={30} />,
        label: 'Settings',
        url: `/{userId}/settings`
    },
    {
        icons: <CiSettings size={30} />,
        label: 'Setting',
        url: `/{userId}`
    },
    {
        icons: <IoLogoBuffer size={30} />,
        label: 'Log',
        url: `/{userId}`
    },
    {
        icons: <TbReportSearch size={30} />,
        label: 'Report',
        url: `/{userId}`
    }
]

export default function Nav() {
    const [open, setOpen] = useState(true);

    useEffect(() =>{
        const sidebarOpen = localStorage.getItem('sidebarOpen');
        if(sidebarOpen === "false"){
            setOpen(false);
        }
    },[]);

    const handleSidebarToggle = () => {
        const newState = !open
        setOpen(newState);
        localStorage.setItem("sidebarOpen",`${newState}`);
    }


    return (
        <nav className={`sticky top-0 shadow-md h-screen p-2 flex flex-col duration-500 bg-[#A882DD] text-white ${open ? 'w-60' : 'w-16'}`}>

            {/* Header */}
            <div className=' px-3 py-2 h-20 flex justify-between items-center'>
                <h2 className={`transition text-4xl ${open ? 'w-10 duration-500' : 'w-0 scale-0'} rounded-md`} >
                    investo
                </h2>
                <button onClick={handleSidebarToggle} className={`h-full ${open ? "" : "w-full"}`}>
                    <div className={"w-full flex flex-col items-center gap-y-1"}>
                        <span className={`w-9 bg-white h-1 transition duration-170 rounded-full ${open? "translate-y-3 rotate-45":""}`}></span>
                        <span className={`w-9 bg-white h-1 transition duration-170 rounded-full ${open? "translate-y-1 rotate-45":""}`}></span>
                        <span className={`w-9 bg-white h-1 transition duration-170 rounded-full ${open? "-translate-y-1 -rotate-45":""}`}></span>
                    </div>
                </button>
            </div>

            {/* Body */}

            <ul className='flex-1'>
                {
                    menuItems.map((item, index) => {
                        return (
                            <li key={index} className={`px-2 py-2 my-2 hover:bg-blue-800 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group  ${open ? "":"justify-between"}`}>
                                <Link href={`${item.url}`} className={"flex items-center gap-2"}>
                                    <div>{item.icons}</div>
                                    <p className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>{item.label}</p>
                                    <p className={`${open && 'hidden'} absolute left-32 shadow-md rounded-md
                                         w-0 p-0 text-black bg-white duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16
                                        `}>{item.label}
                                    </p>
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
            {/* footer */}
            <div className='flex items-center gap-2 px-2 py-2'>
                <Link href={`/{userId}/settings`} className={"flex items-center gap-2"}>
                    <div><MdAccountCircle size={30} /></div>
                    <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
                        <p>Saheb</p>
                        <span className='text-xs'>saheb@gmail.com</span>

                    </div>
                </Link>
            </div>


        </nav>
    )
}