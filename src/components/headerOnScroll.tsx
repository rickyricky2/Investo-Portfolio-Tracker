'use client'
import Link from 'next/link';
import Logo from '../components/Logo'
import {useEffect, useState} from "react";

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
        <header className={`bg-[#A882DD] rounded-b-sm sm:sticky top-0 tracking-tight z-20 backdrop-blur-xl opacity-99 transition-all duration-1000
            ${scrolled ? "": ""} `}>
            <div className={`sm:flex justify-between transition-all duration-1000 p-4 items-center w-8/10 m-auto
                ${scrolled ? "sm:p-0 sm:pt-1":"sm:pt-8"}`}>
                <Link href={"/"}>
                    <Logo scrolled={scrolled}></Logo>
                </Link>
                <div className={"flex gap-3 h-full justify-center items-center my-4 sm:m-0 sm:gap-10"}>
                    <Link href={"/login"} className={"text-2xl bg-[#49416D] py-2 px-3 rounded-lg text-white transition-transform hover:-translate-y-2"}>
                        Log In
                    </Link>
                    <Link href={"/product"} className={"text-2xl bg-[#49416D] py-2 px-3 rounded-lg text-white transition-transform hover:-translate-y-2"}>
                        Register
                    </Link>
                </div>
            </div>
        </header>
    );
}