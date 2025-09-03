"use client";
import {MdAccountCircle, MdCancel} from "react-icons/md";
import { IoMdLock, IoMdMail, IoMdColorPalette  } from "react-icons/io";
import { AiFillDollarCircle } from "react-icons/ai";
import { IoPencil } from "react-icons/io5";
import React, {useState,useEffect} from 'react';
import {FaCheckCircle, FaChevronDown} from "react-icons/fa";
import {currencies} from "@/content/assetContent"
import {z} from "zod";
import bcrypt from "bcryptjs";
import {useNotification} from "./changeNotification";
import {ReactElement} from "react";

const emailSchema = z.object({
    email: z.string().email("Incorrect email format, try example@email.com").min(1, "Enter your email address"),
});

const passwordSchema = z.object({
    password: z.string().min(8,"Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type accountSettings = {
    icon:ReactElement;
    label:string;
    name:string;
    data:string;
}
const accountSettings:Record<string,accountSettings> = {
    userCredentials: {
        icon: <MdAccountCircle size={35}/>,
        label: "User credentials",
        name: "userCredentials",
        data: "",
    },
    email: {
        icon: <IoMdMail  size={35}/>,
        label: "Email",
        name: "email",
        data: "",
    },
    password: {
        icon: <IoMdLock size={35}/>,
        label: "Password",
        name: "password",
        data: "",
    },
    mainCurrency: {
        icon: <AiFillDollarCircle size={35}/>,
        label: "Main Currency",
        name: "mainCurrency",
        data: "",
    },
    theme: {
        icon: <IoMdColorPalette size={35}/>,
        label: "Theme",
        name: "theme",
        data: "",
    },
};

export default function SettingsClient(){
    const [settings, setSettings] = useState(accountSettings);
    const [editingId, setEditingId] = useState<string>("");
    const [editedValue, setEditedValue] = useState<string>("");
    const [editedValueError, setEditedValueError] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [oldPasswordInput, setOldPasswordInput] = useState<string>("");
    const [newPasswordInput, setNewPasswordInput] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { showNotification } = useNotification();

    const grabUserCredentials = async () => {
        const res = await fetch(`${baseURL}/api/auth/me`,{
            method: "GET",
        });
        const data = await res.json();
        if(!data.success){
            console.error(data.error);
        }else{
            setSettings( prev => ({
                ...prev,
                userCredentials: {
                    ...prev.userCredentials,
                    data: data.user.firstName + " " + data.user.lastName,
                },
                email: {
                    ...prev.email,
                    data: data.user.email,
                },
            }));
        }
    }
    const grabTheme = async () => {
        setSettings( prev => ({
            ...prev,
            theme: {
                ...prev.theme,
                data: localStorage.getItem("theme") || "light",
            },
        }));
    }

    const grabMainCurrency = async () => {
        setSettings( prev => ({
            ...prev,
            mainCurrency: {
                ...prev.mainCurrency,
                data: localStorage.getItem("mainCurrency") || "USD",
            },
        }));
    }
    const grabPassword = async (userId:string) => {
        const res = await fetch(`${baseURL}/api/user?id=${userId}`,{
            method: "GET",
        });
        const data = await res.json();
        if(!data.success){
            console.error(data.error);
        }else {
            setPassword(data.userData.password);
            setSettings( prev => ({
                ...prev,
                password: {
                    ...prev.password,
                    data: "••••••••",
                }
            }));
        }
    }


    const grabData = async (userId:string) => {
        grabUserCredentials();
        grabMainCurrency();
        grabTheme();
        grabPassword(userId);
    }

    useEffect( () => {
        const fetchId = async () => {
            const token = document.cookie.split("; ").find( (row) => row.startsWith("login_token"))?.split("=")[1];
            const res = await fetch(`${baseURL}/api/auth/validate`,{
                method: "GET",
                headers:{Authorization: `Bearer ${token}`}
            });
            const data = await res.json();
            if(data?.userId){
                setUserId(data.userId);
                grabData(data.userId);
            }
        }
        fetchId();
    },[]);

    const startEditing = (settings: accountSettings) => {
        setEditedValueError("");
        setOldPasswordInput("");
        setNewPasswordInput("");
        setEditingId(settings.name);
        setEditedValue(settings.data);
    };

    const cancelEditing = () => {
        setOldPasswordInput("");
        setNewPasswordInput("");
        setEditedValueError("");
        setEditingId("");
        setEditedValue("");
    };

    const handleChange = (value: string) => {
        setEditedValue(value);
        setEditedValueError("");
    };

    const saveChanges = async (id:string) => {
        setEditedValueError("");
        switch(id){
            case "mainCurrency":
                localStorage.setItem("mainCurrency",editedValue);
                grabMainCurrency();
                break;
            case "theme":
                localStorage.setItem("theme",editedValue);
                document.documentElement.classList.remove("dark", "light");
                document.documentElement.classList.add(editedValue);
                grabTheme();
                break;
            case "email":
                const email = settings.email.data;
                if(email === editedValue){
                    setEditedValueError("Can't change to the same email");
                    return;
                }
                const validateEmail = emailSchema.safeParse( {email: editedValue});
                if(!validateEmail.success) {
                    setEditedValueError("Wrong email format");
                    return;
                }
                await fetch(`${baseURL}/api/user`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({userId, dataType: "email", email: editedValue}),
                });
                grabUserCredentials();
                break;
            case "userCredentials":
                await fetch(`${baseURL}/api/user`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({userId, dataType:"userCredentials", userName:editedValue }),
                });
                grabUserCredentials();
                break;
            case "password":
                if(newPasswordInput === "" || oldPasswordInput === ""){
                    setEditedValueError("Password must be at least 8 characters long");
                    return;
                }
                if(newPasswordInput === oldPasswordInput) {
                    setEditedValueError("New password cannot be the same as your existing password.");
                    return;
                }

                const validatePassword = passwordSchema.safeParse({password: newPasswordInput});
                if(!validatePassword.success) {
                    setEditedValueError("Wrong new password format");
                    return;
                }

                const passwordMatch = await bcrypt.compare(oldPasswordInput,password);
                if(!passwordMatch){
                    setEditedValueError("The password you entered was incorrect.");
                    return;
                }
                const hashedNewPasswordInput = await bcrypt.hash(newPasswordInput,10);
                await fetch(`${baseURL}/api/user`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({userId, dataType:"password", password:hashedNewPasswordInput }),
                });
                break;
        }
        showNotification("Changes have been saved");
        cancelEditing();
    };


    const editableInput = () =>
        editingId === "mainCurrency"
            ? (<section className={"relative"}>
                <select
                    className={`rounded-xl backdrop-blur-md bg-transparent focus:bg-light-bg-secondary dark:focus:bg-dark-bg-tertiary focus:font-medium focus:text-light-text-tertiary dark:focus:text-dark-tertiary text-2xl outline-none appearance-none px-1 text-light-text-tertiary dark:text-dark-tertiary`}
                    value={editedValue}
                    onChange={e => handleChange(e.target.value)}
                >
                    {currencies.map( (item,index) => {
                        return(
                            <option key={index} value={item.value}>{item.value}</option>
                        );
                    })}
                </select>
                <FaChevronDown className={`absolute left-15 top-2 text-light-main dark:text-dark-text-secondary`} size={20} />
            </section>)
            : editingId === "theme"
                ? (<section className={"relative"}>
                    <select
                        className={`rounded-xl backdrop-blur-md bg-transparent focus:bg-light-bg-secondary dark:focus:bg-dark-bg-tertiary focus:font-medium focus:text-light-text-tertiary dark:focus:text-dark-tertiary text-2xl outline-none appearance-none px-1 text-light-text-tertiary dark:text-dark-tertiary`}
                        value={editedValue}
                        onChange={e => handleChange(e.target.value)}
                    >
                        <option value={"light"}>light</option>
                        <option value={"dark"}>dark</option>
                    </select>
                    <FaChevronDown className={`absolute left-15 top-2 text-light-main dark:text-dark-text-secondary`} size={20} />
                </section>)
                : editingId === "password"
                    ? (<section className={"relative"}>
                        <input
                            className={`
                px-2 text-center outline-none font-semibold
                border-b-2 py-1
                text-light-text border-light-main
                dark:text-dark-text dark:border-dark-text-tertiary
                dark:focus:bg-dark-bg-secondary dark:focus:border-dark-text-secondary
            `}
                            value={oldPasswordInput}
                            type={"password"}
                            placeholder={"Old password"}
                            onChange={e => {setOldPasswordInput(e.target.value)
                                setEditedValueError("");}}
                            style={{
                                boxShadow: '0 1px 4px 0 rgba(168,130,221,0.13)',
                            }}
                        />
                        <input
                            className={`
                                        px-2 text-center outline-none font-semibold
                                        border-b-2 py-1
                                        text-light-text border-light-main
                                        dark:text-dark-text dark:border-dark-text-tertiary
                                        dark:focus:bg-dark-bg-secondary dark:focus:border-dark-text-secondary
                                    `}
                            value={newPasswordInput}
                            type={"password"}
                            placeholder={"New password"}
                            onChange={e => {setNewPasswordInput(e.target.value);
                                setEditedValueError("");}}
                            style={{
                                boxShadow: '0 1px 4px 0 rgba(168,130,221,0.13)',
                            }}
                        />
                        {editedValueError && <p className={"text-light-error-text dark:text-dark-error-text"}>{editedValueError}</p>}
                    </section>)
                    : (<section>
                        <input
                            className={`
                                        px-2 text-center outline-none font-semibold
                                        border-b-2 py-1
                                        text-light-text border-light-main
                                        dark:text-dark-text dark:border-dark-text-tertiary
                                        dark:focus:bg-dark-bg-secondary dark:focus:border-dark-text-secondary
                                        `}
                            value={editedValue}
                            onChange={e => handleChange(e.target.value)}
                            style={{
                                boxShadow: '0 1px 4px 0 rgba(168,130,221,0.13)',
                            }}
                        />
                        {editedValueError && <p className={"text-light-error-text dark:text-dark-error-text"}>{editedValueError}</p>}
                    </section>)

    return(
        <div className={"relative flex flex-col"}>
            <h2 className={"px-4 mt-5 text-4xl lg:text-5xl font-bold bg-[linear-gradient(130deg,var(--color-light-main),hsl(300,70%,80%))] dark:bg-[linear-gradient(130deg,var(--color-dark-main),hsl(266,50%,35%))] bg-clip-text text-transparent"}>
                Account
            </h2>
            <main
                className={`px-2 pb-20 overflow-auto w-full min-h-screen relative grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 md:gap-y-10 md:gap-x-50 font-medium transition-all mt-5 tracking-tighter`}>
                {Object.keys(settings).map( key => {
                    const isEditing = settings[key].name === editingId;
                    return (
                        <div
                            key={settings[key].name}
                            className={` w-full min-h-[160px] shadow-2xl rounded-4xl overflow-hidden bg-light-bg-secondary dark:bg-dark-bg-tertiary`}>
                            <div className={`text-2xl p-5 `}>
                                <div
                                    className={` text-light-main dark:text-dark-main bg-[hsl(260,60%,90%)] dark:bg-[hsl(258,20%,65%)] w-[45px] h-[45px] rounded-2xl flex justify-center items-center `}>
                                    {settings[key].icon}
                                </div>
                                <section className={" dark:text-dark-text-secondary py-1"}>
                                    {isEditing
                                        ? editableInput()
                                        : settings[key].data}
                                </section>
                                <div className={"text-dark-text-secondary dark:text-dark-text-tertiary font-medium text-xl flex gap-2 items-center"}>
                                    {settings[key].label}
                                    {isEditing ? (
                                        <div className={"flex items-center justify-evenly gap-2 px-2"}>
                                            <FaCheckCircle size={23} className={"text-green-500 cursor-pointer"} onClick={ () => saveChanges(settings[key].name)} />
                                            <MdCancel size={26} className={"text-light-error-text dark:text-dark-error-text cursor-pointer"} onClick={cancelEditing} />
                                        </div>
                                    ) : (
                                        <IoPencil  className={"text-light-dark-secondary dark:text-dark-text-tertiary cursor-pointer"} onClick={() => startEditing(settings[key])} size={20} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
}