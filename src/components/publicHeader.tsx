"use client";
import Link from "next/link";
import SwitchThemeButton from "@/app/(dashboard)/components/SwitchThemeButton";
import {useState} from "react";

export default function PublicHeader(){
    const [isOpen, setIsOpen] = useState(false);

    return(
        <header className={`transition-[max-height] max-w-screen ${isOpen ? "max-h-[130px]" : "max-h-[70px]"}  pb-1 sm:pb-1 bg-light-main dark:bg-dark-main rounded-b-sm sm:sticky shadow-sm tracking-tight z-20 flex flex-col gap-2 tiny:gap-0 tiny:flex-row tiny:justify-between items-center px-2 md:px-5 lg:px-10`}>
            <div className={"flex items-center flex-1"}>
                <Link href={"/"}>
                    <div className={"text-6xl inline-block text-light-text-secondary dark:text-dark-text font-semibold"}>
                        investo
                    </div>
                </Link>
                <div className={"justify-self-end tiny:hidden w-full relative top-[6px] -right-[25px]"} onClick={()=>{setIsOpen(!isOpen)}} >
                    <span className={`bg-light-text-secondary dark:bg-dark-text w-[30px] h-[5px] rounded-full absolute transition ${isOpen ? "rotate-45" : "-rotate-45"}`}></span>
                    <span className={`bg-light-text-secondary dark:bg-dark-text w-[30px] h-[5px] rounded-full absolute transition translate-x-[60%] ${isOpen ? "rotate-135" : "rotate-225"}`}></span>
                </div>
            </div>
            <div className={`transition-all ${isOpen ? "opacity-100" : "opacity-0 -translate-y-2"} tiny:opacity-100 tiny:translate-0`}>
                <SwitchThemeButton type={"horizontal"}/>
            </div>
        </header>
    );
}