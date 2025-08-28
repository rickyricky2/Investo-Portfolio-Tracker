"use client";
import { FaMoon,FaSun } from "react-icons/fa";
import{useState,useEffect} from "react";

export default function SwitchThemeButton({type}:{type:string}){
    const [theme, setTheme] = useState<string>("");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if(!savedTheme){
            const prefersDark:boolean = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(prefersDark ? "dark" : "light");
            return;
        }

        setTheme(savedTheme);
    },[]);

    const handleThemeClick = () =>{
        let newTheme = theme;
        if(theme === "dark"){
            newTheme = "light";
        }
        else if(theme === "light"){
            newTheme = "dark";
        }
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(newTheme);
    }

    if(type === "horizontal"){
        return(
            <div className={"rounded-full bg-light-bg-tertiary border-2 border-gray-300 dark:border-dark-text flex flex-col items-start shadow-sm justify-between h-[50px] w-[80px] lg:w-[100px] overflow-hidden"}>
                <div className={` bg-light-text-tertiary dark:bg-dark-main w-[50px] h-full rounded-full overflow-hidden flex items-center justify-center transition 
                ${theme === "dark" ? "translate-x-[26px] lg:translate-x-[46px]" : ""}` }
                     onClick={handleThemeClick}>
                    {theme === "light" ? (
                        <FaSun className={"text-light-text-secondary "} size={20}  />
                    ) : (
                        <FaMoon className={"dark:text-dark-text"} size={20} />
                    )}
                </div>
            </div>
        );
    }
    else if(type === "vertical"){
        return(
            <div className={"rounded-full bg-[hsl(266,40%,80%)] border-2 border-gray-300 dark:border-dark-text flex shrink-0 flex-col items-center shadow-sm justify-between h-[100px] mb-5 w-[48px] overflow-hidden"}>
                <div className={` bg-light-text-tertiary dark:bg-dark-main w-full h-[50px] rounded-full overflow-hidden flex items-center justify-center transition 
                ${theme === "dark" ? "translate-y-[46px]" : ""}` }
                     onClick={handleThemeClick}>
                    {theme === "light" ? (
                        <FaSun className={"text-light-text-secondary "} size={20}  />
                    ) : (
                        <FaMoon className={"dark:text-dark-text"} size={20} />
                    )}
                </div>
            </div>
        );
    }
}