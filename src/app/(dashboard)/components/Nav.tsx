"use client";
import Link from "next/link";
import {  MdOutlineAccountCircle, MdOutlineDashboard  } from "react-icons/md";
import SwitchThemeButton from "./SwitchThemeButton";
import { useState,useEffect } from 'react';
import {useRouter} from "next/navigation";
// icons

import { CiSettings } from "react-icons/ci";
import { RiLogoutCircleLine } from "react-icons/ri";
import { HiOutlineWallet } from "react-icons/hi2";

export default function Nav() {
    const [open, setOpen] = useState(true);
    const [userData, setUserData] = useState({
        id: "",
        email: "",
        firstName: "",
        lastName: "",
    });

    const router = useRouter();

    const menuItems = [
        {
            icons: <MdOutlineDashboard size={30} />,
            label: 'Dashboard',
            url: `${userData.id}`
        },
        {
            icons: <HiOutlineWallet size={30} />,
            label: 'Wallet',
            url: `${userData.id}/wallet`
        },
        {
            icons: <CiSettings size={30} />,
            label: 'Settings',
            url: `${userData.id}/settings`
        },
    ]

    useEffect(() =>{
        const sidebarOpen = localStorage.getItem('sidebarOpen');
        if(sidebarOpen === "false"){
            setOpen(false);
        }
    },[]);

    useEffect( () => {
        const getUserInfo = async () => {
            const res = await fetch("/api/auth/me", {
                method: "GET",
            });

            const data = await res.json();

            if(!data.loggedIn){
                console.log(data?.message);
                router.push("/login");
            }

            setUserData(data.user);
        }
        getUserInfo();
    },[]);

    const handleSidebarToggle = () => {
        const newState = !open
        setOpen(newState);
        localStorage.setItem("sidebarOpen",`${newState}`);
    }

    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
        })
        router.push("/login");
    }


    return (
        <nav className={`font-medium sticky top-0 shadow-[4px_0_10px_rgba(0,0,0,0.12)] h-screen p-2 flex flex-col duration-500 bg-light-bg-tertiary dark:bg-dark-bg-tertiary dark:text-dark-text-tertiary text-light-text-tertiary ${open ? 'w-60' : 'w-16'}`}>

            {/* Header */}
            <div className=' px-3 py-2 h-20 flex justify-between items-center'>
                <h2 className={`text-light-main dark:text-dark-main font-bold transition scale-y-110 text-4xl ${open ? 'w-10 duration-500' : 'w-0 scale-0'} rounded-md`} >
                    investo
                </h2>
                <button onClick={handleSidebarToggle} className={`h-full ${open ? "" : "w-full"}`}>
                    <div className={"w-full flex flex-col items-center gap-y-1"}>
                        <span className={`w-8 bg-light-text-tertiary dark:bg-dark-text-tertiary h-1 transition duration-170 rounded-full ${open? "translate-y-3 rotate-45":""}`}></span>
                        <span className={`w-8 bg-light-text-tertiary dark:bg-dark-text-tertiary h-1 transition duration-170 rounded-full ${open? "translate-y-1 rotate-45":""}`}></span>
                        <span className={`w-8 bg-light-text-tertiary dark:bg-dark-text-tertiary h-1 transition duration-170 rounded-full ${open? "-translate-y-1 -rotate-45":""}`}></span>
                    </div>
                </button>
            </div>

            {/* Body */}

            <ul className='flex-1'>
                {
                    menuItems.map((item, index) => {
                        return (
                            <li key={index} className={`px-2 py-2 my-2 hover:bg-[hsl(266,40%,85%)] hover:scale-103 dark:hover:bg-[hsl(259,17%,12%)] rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group  ${open ? "":"justify-between"}`}>
                                <Link href={`/${item.url}`} className={"flex items-center gap-2"}>
                                    <div>{item.icons}</div>
                                    <p className={`${!open && 'w-0 translate-x-24 opacity-0'} duration-500 overflow-hidden`}>{item.label}</p>
                                    <p className={`${open && 'hidden'}  absolute left-32 shadow-xl rounded-xl
                                         w-0 p-0 text-light-text-tertiary dark:text-dark-text-tertiary bg-[hsl(266,40%,94%)] dark:bg-[hsl(259,17%,25%)] font-medium duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16
                                        `}>{item.label}
                                    </p>
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
            {/* theme switch */}
            <div className={"flex gap-2 items-center relative "}>
                <SwitchThemeButton type={"vertical"}/>
                <div className={`h-full flex flex-col justify-evenly cursor-default duration-500 overflow-hidden mb-4 ${!open && 'w-0 translate-x-24'}`}>
                    <p>Light</p>
                    <p>Dark</p>
                </div>
            </div>
            {/* footer */}
            <div className='flex flex-col items-start gap-2 py-2 '>
                <div className={"flex items-center px-2 gap-2 cursor-default"}>
                    <div>< MdOutlineAccountCircle  className={"text-light-text-tertiary dark:text-dark-text-tertiary"} size={30} /></div>
                    <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
                        <p>
                            {userData.firstName && `${userData.firstName.at(0)!.toUpperCase()}${userData.firstName.slice(1)} `}
                            {userData.lastName && `${userData.lastName}`}
                        </p>
                        <span className='text-xs'>{userData.email}</span>
                    </div>
                </div>
                <div className={`w-full px-2 py-2 hover:scale-103 hover:bg-[hsl(266,40%,85%)] dark:hover:bg-[hsl(259,17%,12%)] rounded-md duration-300 cursor-pointer flex  items-center relative group  ${open ? "":"justify-between"}`}>
                    <div className={"flex items-center gap-2 "} onClick={handleLogout}>
                        <div><RiLogoutCircleLine size={30} /></div>
                        <p className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>Logout</p>
                        <p className={`${open && 'hidden'} absolute left-32 shadow-md rounded-md
                                         w-0 p-0 text-light-text-tertiary dark:text-dark-text-tertiary bg-[hsl(266,40%,94%)] dark:bg-[hsl(259,17%,25%)] font-medium duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16
                                        `}>Logout
                        </p>
                    </div>
                </div>
            </div>


        </nav>
    )
}