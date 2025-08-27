"use client";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import SwitchThemeButton from "../components/SwitchThemeButton";
import {useRouter} from "next/navigation";

import {MdOutlineDashboard, MdSpaceDashboard} from "react-icons/md";
import {IoLogoBuffer, IoMdWallet} from "react-icons/io";
import {CiSettings} from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import {TbReportSearch} from "react-icons/tb";

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
            icons: <MdSpaceDashboard size={30} />,
            label: 'Dashboard',
            url: `${userData.id}`
        },
        {
            icons: <IoMdWallet size={30} />,
            label: 'Wallet',
            url: `${userData.id}/wallet`
        },
        {
            icons: <IoLogoBuffer size={30} />,
            label: 'Account',
            url: `${userData.id}/`
        },
    ]

    return(
        <div className={" relative"}>
            <nav className="w-full h-12  fixed bg-light-main dark:bg-dark-main text-light-text-secondary dark:text-dark-text rounded-b-sm shadow-sm bottom-0 z-10 flex items-center justify-center">
                <div className="w-full flex items-center justify-center">
                    <ul className="w-full flex items-center justify-evenly">
                        <li>
                            <Link href={`/${userData.id}`} >
                                <MdSpaceDashboard size={30} />
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${userData.id}/wallet`} >
                                <IoMdWallet size={30} />
                            </Link>
                        </li>
                        <li>
                            <AddAssetButton/>
                        </li>
                        <li>
                            <Link href={`/${userData.id}/account`} >
                                <MdAccountCircle size={30} />
                            </Link>
                        </li>
                        <button onClick={handleSidebarToggle} className={`h-full ${open ? "" : ""}`}>
                            <div className={"w-full flex flex-col items-center gap-y-1"}>
                                <span className={`w-[30px] bg-light-text-secondary dark:bg-dark-text h-[3px] transition duration-170 rounded-full ${open? "translate-y-[7px] rotate-45":""}`}></span>
                                <span className={`w-[30px] bg-light-text-secondary dark:bg-dark-text h-[3px] transition duration-170 rounded-full ${open? "translate-y-[0px] rotate-45":""}`}></span>
                                <span className={`w-[30px] bg-light-text-secondary dark:bg-dark-text h-[3px] transition duration-170 rounded-full ${open? "-translate-y-[7px] -rotate-45":""}`}></span>
                            </div>
                        </button>
                    </ul>
                </div>
            </nav>
            <nav ref={wrapperRef} className={`fixed flex flex-col py-4 justify-end gap-70 right-0 top-0 z-30 shadow-sm  bg-light-main dark:bg-dark-main w-fit sm:w-[150px] md:w-[200px] min-h-screen transition ${open ? "" : "translate-x-100"}`}>
                    <ul className={"text-light-text-secondary dark:text-dark-text py-5 font-medium"}>
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
                    <div className={"mx-4"}>
                        <SwitchThemeButton type={"horizontal"}/>
                    </div>
                    <div className={"mx-4"}>
                        <button onClick={handleSidebarToggle} className={`h-full ${open ? "" : ""}`}>
                            <div className={"w-full flex flex-col items-center gap-y-1"}>
                                <span className={`w-[30px] bg-light-text-secondary dark:bg-dark-text h-[3px] transition duration-170 rounded-full ${open? "translate-y-[7px] rotate-45":""}`}></span>
                                <span className={`w-[30px] bg-light-text-secondary dark:bg-dark-text h-[3px] transition duration-170 rounded-full ${open? "translate-y-[0px] rotate-45":""}`}></span>
                                <span className={`w-[30px] bg-light-text-secondary dark:bg-dark-text h-[3px] transition duration-170 rounded-full ${open? "-translate-y-[7px] -rotate-45":""}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}