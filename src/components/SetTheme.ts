"use client"
import { useEffect } from "react";

export default function SetTheme() {
    useEffect(() => {
        const theme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        document.documentElement.classList.remove("dark");

        if (theme) {
            document.documentElement.classList.add(theme);
        } else {
            document.documentElement.classList.add(prefersDark ? "dark" : "light");
        }
    }, []);

    return null
}