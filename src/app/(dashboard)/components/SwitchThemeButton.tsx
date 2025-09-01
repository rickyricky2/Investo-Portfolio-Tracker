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
            <div className={"rounded-full bg-light-bg-tertiary dark:bg-dark-bg-tertiary border-2 border-light-text-tertiary dark:border-dark-text-tertiary flex flex-col items-start shadow-sm justify-between h-[50px] overflow-hidden"}>
                <div className={` bg-transparent text-light-text-tertiary  dark:text-dark-text-tertiary w-[45px] h-full rounded-full overflow-hidden flex items-center justify-center transition 
                ` }
                     onClick={handleThemeClick}>
                    {theme === "light" ? (
                        <FaSun size={20}  />
                    ) : (
                        <FaMoon  size={20} />
                    )}
                </div>
            </div>
        );
    }
    else if(type === "vertical"){
        return(
            <div className={"rounded-full bg-light-bg-tertiary dark:bg-dark-bg-tertiary border-2 border-light-text-tertiary dark:border-dark-text-tertiary flex shrink-0 flex-col items-center shadow-sm justify-between h-[90px] mb-5 w-[48px] overflow-hidden"}>
                <div className={` bg-transparent text-light-text-tertiary  dark:text-dark-text-tertiary  w-full h-[44px] rounded-full overflow-hidden flex items-center justify-center transition 
                ${theme === "dark" ? "translate-y-[42px]" : ""}` }
                     onClick={handleThemeClick}>
                    {theme === "light" ? (
                        <FaSun size={20}  />
                    ) : (
                        <FaMoon size={20} />
                    )}
                </div>
            </div>
        );
    }
}