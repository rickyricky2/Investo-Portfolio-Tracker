"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdRemoveCircleOutline } from "react-icons/md";

type NotificationContextType = {
    showNotification: (message?: string, isValid?:boolean) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({children}:{children: ReactNode}) => {
    const [notification, setNotification] = useState<string>("Changes have been saved");
    const [show, setShow] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(true);

    const showNotification = (message?:string,isValid:boolean = true) => {
        setIsValid(isValid);
        if(message) setNotification(message);
        setShow(true);
        setTimeout(() => {
            setShow(false);
        },1700);
    };

    return(
        <NotificationContext.Provider value={ {showNotification} }>
            {children}
            <div className={"flex justify-evenly items-center"}>
            <div className={`flex justify-center transition-[top] duration-600 fixed z-[999] ${show ? "top-3 opacity-100" : "-top-20 "}`}>
                <div className={"absolute min-w-[300px] z-40 text-xl font-medium dark:text-dark-text-secondary bg-transparent backdrop-blur-sm rounded-4xl shadow-2xl/40 flex p-3 justify-evenly items-center gap-2"}>
                    {isValid
                        ? <FaRegCheckCircle className={"text-green-600"} size={25}/>
                        : <MdRemoveCircleOutline className={"text-light-error-text dark:text-dark-error-text"} size={25}/>}
                    {notification}
                </div>
            </div>
            </div>
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useAlert must be used within AlertProvider");
    return context;
};