'use client'
import Link from 'next/link';
import Logo from '../components/Logo'
import {useEffect, useState} from "react";
import SwitchThemeButton from "@/app/(dashboard)/components/SwitchThemeButton";

export default function HeaderOnScroll() {
    const [ scrolled,setScrolled ] = useState(false);

    useEffect( () => {
        const handleScroll = () => {
            const y = window.scrollY;
            setScrolled( (prev) => {
                if(!prev && y>60) return true;
                if(prev && y<20) return false;
                return prev;
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return(
        <header className={`bg-light-main dark:bg-dark-main sm:sticky top-0 tracking-tight z-20 shadow-md backdrop-blur-xl opacity-99 transition-all duration-1000`}>
            <div className={`sm:flex justify-between transition-all duration-1000 px-4 lg:px-10 py-1 items-center w-full
                ${scrolled ? "sm:py-0 ":"sm:py-2"}`}>
                <Link href={"/"} className={"lg:ml-10"}>
                    <Logo></Logo>
                </Link>
                <div className={"flex gap-3 h-full flex-wrap justify-center items-center my-4 sm:m-0 md:gap-4 lg:gap-10"}>
                    <Link href={"/login"} className={"text-2xl bg-light-secondary dark:bg-dark-bg-tertiary py-2 px-3 rounded-lg text-light-text-secondary dark:text-dark-text-secondary transition-transform hover:-translate-y-2"}>
                        Log In
                    </Link>
                    <Link href={"/product"} className={"text-2xl bg-light-secondary dark:bg-dark-bg-tertiary py-2 px-3 rounded-lg text-light-text-secondary dark:text-dark-text-secondary transition-transform hover:-translate-y-2"}>
                        Register
                    </Link>
                </div>
            </div>
        </header>
    );
}