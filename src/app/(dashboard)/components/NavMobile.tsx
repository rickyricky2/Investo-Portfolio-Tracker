"use client";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import SwitchThemeButton from "../components/SwitchThemeButton";
import {useRouter} from "next/navigation";

import { HiOutlineWallet } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDashboard  } from "react-icons/md";

import AddAssetButton from "../components/addAssetButton";

export default function NavMobile(){
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(true);
    const [userData, setUserData] = useState({
        id: "",
        email: "",
        firstName: "",
        lastName: "",
    });

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
            icons: <IoSettingsOutline size={30} />,
            label: 'Settings',
            url: `${userData.id}/settings`
        },
    ]

    return(
        <div className={" relative"}>
            <nav className="w-full h-14  fixed bg-light-bg-tertiary  text-light-text-tertiary dark:bg-dark-bg-tertiary dark:text-dark-text-tertiary rounded-b-sm shadow-[0_-4px_10px_rgba(0,0,0,0.12)] bottom-0 z-10 flex items-center justify-center">
                <div className="w-full flex items-center justify-center">
                    <ul className="w-full flex items-center justify-evenly">
                        <li className={"flex flex-col justify-center items-center tracking-tighter"}>
                            <Link href={`/${userData.id}`} >
                                <MdOutlineDashboard size={20} />
                            </Link>
                            <p className={`text-sm font-medium`}>Dashboard</p>
                        </li>
                        <li className={"flex flex-col justify-center items-center tracking-tighter"}>
                            <Link href={`/${userData.id}/wallet`} >
                                <HiOutlineWallet size={20} />
                            </Link>
                            <p className={`text-sm font-medium`}>Wallet</p>
                        </li>
                        <li className={"flex flex-col justify-center items-center tracking-tighter"}>
                            <AddAssetButton mobile={true}/>
                            <p className={`text-sm font-medium leading-2 mb-3`}>Add Asset</p>
                        </li>
                        <li className={"flex flex-col justify-center items-center tracking-tighter"}>
                            <Link href={`/${userData.id}/settings`} >
                                <IoSettingsOutline size={20} />
                            </Link>
                            <p className={`text-sm font-medium`}>Settings</p>
                        </li>
                        <button onClick={handleSidebarToggle} className={`h-full ${open ? "" : ""}`}>
                            <div className={"w-full flex flex-col items-center gap-y-1"}>
                                <span className={`w-[25px] bg-light-text-tertiary dark:bg-dark-text-tertiary h-[3px] transition duration-170 rounded-full ${open? "translate-y-[7px] rotate-45":""}`}></span>
                                <span className={`w-[25px] bg-light-text-tertiary dark:bg-dark-text-tertiary h-[3px] transition duration-170 rounded-full ${open? "translate-y-[0px] rotate-45":""}`}></span>
                                <span className={`w-[25px] bg-light-text-tertiary dark:bg-dark-text-tertiary h-[3px] transition duration-170 rounded-full ${open? "-translate-y-[7px] -rotate-45":""}`}></span>
                            </div>
                        </button>
                    </ul>
                </div>
            </nav>
            <nav ref={wrapperRef} className={`fixed flex flex-col py-4 justify-between items-center  right-0 top-0 z-30 shadow-md  bg-light-bg-tertiary text-light-text-tertiary dark:bg-dark-bg-tertiary dark:text-dark-text-tertiary w-fit sm:w-[150px] md:w-[200px] h-screen transition ${open ? "" : "translate-x-100"}`}>
                <div className={"text-3xl font-medium"}>
                    investo
                </div>
                    <ul className={"py-5 font-medium"}>
                        {menuItems.map((item, index) => {
                            return(
                                <li key={index}>
                                    <Link href={`/${item.url}`}>
                                        <p className={`py-2 px-2 text-lg mx-2 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary active:bg-light-secondary`}>
                                            {item.label}
                                        </p>
                                    </Link>
                                </li>
                            );
                        })}
                        <li>
                            <p className={`py-2 px-2 text-lg mx-2 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary active:bg-light-secondary`}
                                onClick={handleLogout}>
                                Logout
                            </p>
                        </li>
                    </ul>
                <div className={"flex flex-col gap-5"}>
                    <div className={"m-auto"}>
                        <SwitchThemeButton type={"horizontal"}/>
                    </div>
                    <div className={"mx-4 text-center"}>
                        <button onClick={handleSidebarToggle} className={`h-full ${open ? "" : ""}`}>
                            <div className={"w-full flex flex-col items-center gap-y-1"}>
                                <span className={`w-[30px] bg-light-text-tertiary dark:bg-dark-text-tertiary h-[3px] transition duration-170 rounded-full ${open? "translate-y-[7px] rotate-45":""}`}></span>
                                <span className={`w-[30px] bg-light-text-tertiary dark:bg-dark-text-tertiary h-[3px] transition duration-170 rounded-full ${open? "translate-y-[0px] rotate-45":""}`}></span>
                                <span className={`w-[30px] bg-light-text-tertiary dark:bg-dark-text-tertiary h-[3px] transition duration-170 rounded-full ${open? "-translate-y-[7px] -rotate-45":""}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}