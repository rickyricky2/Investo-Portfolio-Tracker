"use client";
import {useLayoutEffect} from "react";

export default function ThemeProvider({children}:{children:React.ReactNode}){

    useLayoutEffect(()=>{
        const theme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if(theme){
            document.documentElement.classList.add(theme);
        }else{
            document.documentElement.classList.add(prefersDark ? "dark" : "light");
        }
    },[]);

    return(
        <>{children}</>
    );
}